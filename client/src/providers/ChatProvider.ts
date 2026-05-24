import { useState, useEffect, useCallback, useRef } from "preact/hooks";
import { createClient, SupabaseClient } from "@supabase/supabase-js";

// Cliente singleton estable para suscripciones realtime
let _client: SupabaseClient | null = null;
const getChatClient = () => {
  if (!_client) {
    _client = createClient(
      import.meta.env.VITE_SUPABASE_URL,
      import.meta.env.VITE_SUPABASE_KEY
    );
  }
  return _client;
};

export interface ChatRoom {
  id: string;
  name: string;
  created_by: string;
  created_at: string;
  description?: string;
}

export interface ChatMessage {
  id: string;
  room_id: string;
  profile_id: string;
  content: string;
  created_at: string;
  profiles?: { full_name: string; email: string };
}

// ─── useRooms ────────────────────────────────────────────────────────────────
export const useRooms = () => {
  const supabase = getChatClient();
  const [rooms, setRooms] = useState<ChatRoom[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchRooms = useCallback(async () => {
    setLoading(true);
    const { data, error: err } = await supabase
      .from("rooms")
      .select("*")
      .order("created_at", { ascending: false });
    if (err) setError(err.message);
    else setRooms(data ?? []);
    setLoading(false);
  }, []);

  useEffect(() => {
    fetchRooms();
    const channel = supabase
      .channel("rooms-changes")
      .on("postgres_changes", { event: "*", schema: "public", table: "rooms" }, () => {
        fetchRooms();
      })
      .subscribe();
    return () => { supabase.removeChannel(channel); };
  }, [fetchRooms]);

  return { rooms, loading, error, refetch: fetchRooms };
};

// ─── useCreateRoom ────────────────────────────────────────────────────────────
export const useCreateRoom = () => {
  const supabase = getChatClient();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const createRoom = async (name: string, profileId: string, description?: string): Promise<ChatRoom | null> => {
    setLoading(true);
    setError(null);
    const { data, error: err } = await supabase
      .from("rooms")
      .insert({ name: name.trim(), created_by: profileId, description: description?.trim() ?? null })
      .select()
      .single();
    setLoading(false);
    if (err) { setError(err.message); return null; }
    return data;
  };

  return { createRoom, loading, error };
};

// ─── useMessages ──────────────────────────────────────────────────────────────
export const useMessages = (roomId: string | null) => {
  const supabase = getChatClient();
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [loading, setLoading] = useState(false);
  const channelRef = useRef<ReturnType<typeof supabase.channel> | null>(null);

  useEffect(() => {
    if (!roomId) { setMessages([]); return; }

    setLoading(true);
    supabase
      .from("messages")
      .select("*, profiles(full_name, email)")
      .eq("room_id", roomId)
      .order("created_at", { ascending: true })
      .then(({ data }) => {
        setMessages((data as ChatMessage[]) ?? []);
        setLoading(false);
      });

    // Suscripción realtime
    channelRef.current = supabase
      .channel(`messages-${roomId}`)
      .on(
        "postgres_changes",
        { event: "INSERT", schema: "public", table: "messages", filter: `room_id=eq.${roomId}` },
        async (payload) => {
          // Obtener perfil del nuevo mensaje
          const { data: profile } = await supabase
            .from("profiles")
            .select("full_name, email")
            .eq("id", payload.new.profile_id)
            .single();
          const msg: ChatMessage = { ...payload.new as ChatMessage, profiles: profile ?? undefined };
          setMessages((prev) => {
            if (prev.find((m) => m.id === msg.id)) return prev;
            return [...prev, msg];
          });
        }
      )
      .subscribe();

    return () => {
      if (channelRef.current) supabase.removeChannel(channelRef.current);
    };
  }, [roomId]);

  return { messages, loading };
};

// ─── useSendMessage ───────────────────────────────────────────────────────────
export const useSendMessage = () => {
  const supabase = getChatClient();
  const [sending, setSending] = useState(false);

  const sendMessage = async (roomId: string, profileId: string, content: string): Promise<boolean> => {
    if (!content.trim()) return false;
    setSending(true);
    const { error } = await supabase
      .from("messages")
      .insert({ room_id: roomId, profile_id: profileId, content: content.trim() });
    setSending(false);
    return !error;
  };

  return { sendMessage, sending };
};

// ─── useTypingIndicator ───────────────────────────────────────────────────────
export const useTypingIndicator = (roomId: string | null, myProfileId: string | null) => {
  const supabase = getChatClient();
  const [typingUsers, setTypingUsers] = useState<string[]>([]);
  const channelRef = useRef<ReturnType<typeof supabase.channel> | null>(null);
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    if (!roomId) return;
    channelRef.current = supabase.channel(`typing-${roomId}`, { config: { presence: { key: myProfileId ?? "anon" } } });
    channelRef.current
      .on("broadcast", { event: "typing" }, (payload: any) => {
        const { profileId, name } = payload.payload as { profileId: string; name: string };
        if (profileId === myProfileId) return;
        setTypingUsers((prev) => (prev.includes(name) ? prev : [...prev, name]));
        setTimeout(() => setTypingUsers((prev) => prev.filter((n) => n !== name)), 3000);
      })
      .subscribe();
    return () => { if (channelRef.current) supabase.removeChannel(channelRef.current); };
  }, [roomId, myProfileId]);

  const broadcastTyping = useCallback((name: string) => {
    if (!channelRef.current || !roomId) return;
    if (timerRef.current) clearTimeout(timerRef.current);
    channelRef.current.send({ type: "broadcast", event: "typing", payload: { profileId: myProfileId, name } });
    timerRef.current = setTimeout(() => {}, 2000);
  }, [roomId, myProfileId]);

  return { typingUsers, broadcastTyping };
};