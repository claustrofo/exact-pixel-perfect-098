import { createFileRoute } from "@tanstack/react-router";
import { Funnel } from "@/components/Funnel";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Mounjaro Natural — Controle sua fome e emagreça" },
      { name: "description", content: "Descubra em 1 minuto como milhares de mulheres estão secando a barriga com o Mounjaro Natural." },
      { property: "og:title", content: "Mounjaro Natural — Controle sua fome e emagreça" },
      { property: "og:description", content: "Descubra em 1 minuto como milhares de mulheres estão secando a barriga com o Mounjaro Natural." },
    ],
  }),
  component: Index,
});

function Index() {
  return <Funnel />;
}
