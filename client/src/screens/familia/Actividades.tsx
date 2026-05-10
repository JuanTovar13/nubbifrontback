import { useState } from "preact/hooks";

import { colors, fonts } from "../../tokens";
import {  TopBar } from "../../components/PhoneFrame";
import { BottomNav, familiaNav } from "../../components/BottomNav";

interface Actividad {
  id: number;
  icon: string;
  titulo: string;
  descripcion: string;
  fecha: string;
  hora: string;
  lugar: string;
}

const actividades: Actividad[] = [
  {
    id: 1,
    icon: "🎨",
    titulo: "Taller de Pintura",
    descripcion: "Un espacio creativo donde familias aprenden técnicas básicas de pintura y expresión artística juntos. Materiales incluidos.",
    fecha: "15 Jun",
    hora: "10:00 am",
    lugar: "Centro Cultural",
  },
  {
    id: 2,
    icon: "📚",
    titulo: "Lectura en Familia",
    descripcion: "Comparte un cuento con tu familia y reflexionen juntos sobre sus valores. Actividad ideal para niños de 5 a 12 años.",
    fecha: "18 Jun",
    hora: "3:00 pm",
    lugar: "Biblioteca Municipal",
  },
  {
    id: 3,
    icon: "🌳",
    titulo: "Paseo al Parque",
    descripcion: "Recorrido guiado por el parque natural de la ciudad. Aprende sobre la flora local y disfruta en familia al aire libre.",
    fecha: "22 Jun",
    hora: "8:00 am",
    lugar: "Parque El Tunal",
  },
  {
    id: 4,
    icon: "🎵",
    titulo: "Taller de Música",
    descripcion: "Introducción a instrumentos de percusión y ritmos folclóricos. No se requiere experiencia previa.",
    fecha: "25 Jun",
    hora: "4:00 pm",
    lugar: "Casa de la Cultura",
  },
  {
    id: 5,
    icon: "🍳",
    titulo: "Cocina Saludable",
    descripcion: "Aprende recetas nutritivas y económicas para preparar en familia. Cada hogar recibe una cartilla de recetas para llevar.",
    fecha: "28 Jun",
    hora: "2:00 pm",
    lugar: "Salón Comunitario",
  },
];

const ActividadCard = ({ act }: { act: Actividad }) => {
  const [abierta, setAbierta] = useState(false);

  return (
    <div
      className="ActividadCard"
      style={{
        background: "white",
        borderRadius: 16,
        overflow: "hidden",
        boxShadow: "0 2px 10px rgba(0,0,0,0.07)",
        transition: "box-shadow 0.2s",
      }}
    >
      {/* Fila colapsada — siempre visible */}
      <button
        onClick={() => setAbierta((v) => !v)}
        style={{
          width: "100%",
          display: "flex",
          alignItems: "center",
          gap: 12,
          padding: "14px 16px",
          background: "none",
          border: "none",
          cursor: "pointer",
          textAlign: "left",
        }}
      >
        {/* Icono */}
        <div style={{
          width: 44,
          height: 44,
          borderRadius: 12,
          background: colors.pinkLight,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          fontSize: 22,
          flexShrink: 0,
        }}>
          {act.icon}
        </div>

        {/* Título */}
        <span style={{
          flex: 1,
          fontWeight: 700,
          fontSize: 14,
          color: colors.text,
          fontFamily: fonts.body,
        }}>
          {act.titulo}
        </span>

        {/* Flecha */}
        <span style={{
          fontSize: 18,
          color: colors.gray500,
          transform: abierta ? "rotate(90deg)" : "rotate(0deg)",
          transition: "transform 0.2s",
          lineHeight: 1,
        }}>
          ›
        </span>
      </button>

      {/* Contenido expandido */}
      {abierta && (
        <div style={{ padding: "0 16px 16px" }}>
          {/* Línea separadora */}
          <div style={{ height: 1, background: colors.gray200, marginBottom: 14 }} />

          {/* Dos columnas: info + descripción */}
          <div style={{ display: "flex", gap: 14 }}>

            {/* Columna izquierda: fecha, hora, lugar */}
            <div style={{
              display: "flex",
              flexDirection: "column",
              gap: 8,
              flexShrink: 0,
              minWidth: 90,
            }}>
              {[
                { icon: "📅", value: act.fecha },
                { icon: "🕐", value: act.hora  },
                { icon: "📍", value: act.lugar },
              ].map(({ icon, value }) => (
                <div key={icon} style={{
                  display: "flex",
                  alignItems: "flex-start",
                  gap: 6,
                }}>
                  <span style={{ fontSize: 13, lineHeight: 1.4 }}>{icon}</span>
                  <span style={{
                    fontSize: 11,
                    color: colors.textLight,
                    fontFamily: fonts.body,
                    lineHeight: 1.4,
                  }}>
                    {value}
                  </span>
                </div>
              ))}
            </div>

            {/* Descripción */}
            <p style={{
              flex: 1,
              fontSize: 12,
              color: colors.textLight,
              fontFamily: fonts.body,
              lineHeight: 1.6,
              margin: 0,
            }}>
              {act.descripcion}
            </p>
          </div>

          {/* Botón Participar */}
          <button style={{
            marginTop: 16,
            width: "100%",
            padding: "11px 0",
            background: `linear-gradient(135deg, ${colors.pinkDark})`,
            border: "none",
            borderRadius: 12,
            color: "white",
            fontWeight: 700,
            fontSize: 13,
            cursor: "pointer",
            fontFamily: fonts.body,
            boxShadow: `0 4px 14px ${colors.pinkDark}40`,
          }}>
            Participar
          </button>
        </div>
      )}
    </div>
  );
};

export const ActividadesScreen = () => {


  return (
    <div style={{display: "flex", flexDirection: "column", overflow: "hidden" }}>
      <TopBar />
      <div className="actividades-screen" style={{ flex: 1, background: colors.offWhite, overflow:"auto", height:"100vh" }}>

        {/* Header */}
        <div style={{
          background: `linear-gradient(135deg, ${colors.pink})`,
          padding: "16px 20px 20px",
        }}>
          <div style={{ fontSize: 17, fontWeight: 800, color: "white", fontFamily: fonts.body }}>
            Actividades
          </div>
          <div style={{ fontSize: 11, color: "rgba(255,255,255,0.85)", marginTop: 2, fontFamily: fonts.body }}>
            Elige una actividad y participa con tu familia
          </div>
        </div>

        {/* Lista de cards */}
        <div className="lista de actividades" style={{ padding: "16px", display: "flex", flexDirection: "column", gap: 12, overflow:"scroll" }}>
          {actividades.map((act) => (
            <ActividadCard key={act.id} act={act} />
          ))}
        </div>
      </div>
      <BottomNav items={familiaNav} />
    </div>
  );
};
