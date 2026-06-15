import { useEffect, useMemo, useState } from "react";
import "./funnel.css";
import perfilCaroline from "@/assets/perfil-caroline.png.asset.json";
import comparativoResultados from "@/assets/comparativo-resultados.png.asset.json";

const TOTAL_STEPS = 16;

declare global {
  interface Window {
    dataLayer?: Array<Record<string, unknown>>;
  }
}

function pushDataLayer(event: string, payload: Record<string, unknown> = {}) {
  if (typeof window === "undefined") return;
  window.dataLayer = window.dataLayer || [];
  window.dataLayer.push({ event, ...payload });
}

function Footer() {
  return (
    <footer className="funnel-footer">
      © 2026 - Criado via inlead.digital | Central de anúncios
    </footer>
  );
}

function Progress({ step }: { step: number }) {
  const pct = Math.round((step / TOTAL_STEPS) * 100);
  return (
    <div className="funnel-progress-wrap">
      <div className="funnel-progress-track">
        <div className="funnel-progress-bar" style={{ width: `${pct}%` }} />
      </div>
      <div className="funnel-progress-label">
        ETAPA {step} DE {TOTAL_STEPS}
      </div>
    </div>
  );
}

function Check() {
  return <span className="funnel-check">✓</span>;
}

function QuizOptions({
  options,
  onPick,
}: {
  options: string[];
  onPick: (value: string) => void;
}) {
  return (
    <div>
      {options.map((opt) => (
        <button key={opt} className="funnel-option" onClick={() => onPick(opt)}>
          {opt}
        </button>
      ))}
    </div>
  );
}

function VimeoEmbed({ id, title }: { id: string; title: string }) {
  return (
    <div className="funnel-video-frame">
      <iframe
        src={`https://player.vimeo.com/video/${id}?badge=0&autopause=0&player_id=0&app_id=58479`}
        allow="autoplay; fullscreen; picture-in-picture; clipboard-write"
        allowFullScreen
        title={title}
      />
    </div>
  );
}

function VideoPlaceholder({ caption }: { caption: string }) {
  return (
    <div className="funnel-video-placeholder" style={{ aspectRatio: "9 / 16", maxWidth: 320, margin: "16px auto" }}>
      <div>
        ▶ Vídeo<br />
        <small style={{ fontWeight: 400 }}>{caption}</small>
      </div>
    </div>
  );
}

function SmartImage({ src, alt, fallbackLabel }: { src: string; alt: string; fallbackLabel: string }) {
  const [failed, setFailed] = useState(false);
  if (failed) {
    return <div className="funnel-img-fallback">🖼 {fallbackLabel}</div>;
  }
  return (
    <img
      src={src}
      alt={alt}
      className="funnel-smart-img"
      loading="lazy"
      onError={() => setFailed(true)}
    />
  );
}

function Battery({ percent, variant, label }: { percent: number; variant: "low" | "high"; label: string }) {
  return (
    <div className="funnel-battery-wrap">
      <div className="funnel-battery">
        <div className={`funnel-battery-body funnel-battery-${variant}`}>
          <div className="funnel-battery-fill" style={{ width: `${percent}%` }}>
            {percent}%
          </div>
        </div>
        <div className="funnel-battery-tip" />
      </div>
      <div className="funnel-battery-label">{label}</div>
    </div>
  );
}

function WhatsAppAudio({ avatarUrl }: { avatarUrl: string }) {
  const [avatarFailed, setAvatarFailed] = useState(false);
  return (
    <div className="funnel-audio-player">
      {avatarFailed ? (
        <div className="funnel-audio-avatar">C</div>
      ) : (
        <img
          src={avatarUrl}
          alt="Foto de perfil"
          className="funnel-audio-avatar"
          style={{ objectFit: "cover" }}
          onError={() => setAvatarFailed(true)}
        />
      )}
      <button className="funnel-audio-play" aria-label="Reproduzir áudio">▶</button>
      <div style={{ flex: 1 }}>
        <div className="funnel-audio-wave">
          {Array.from({ length: 28 }).map((_, i) => (
            <span key={i} style={{ height: `${30 + Math.abs(Math.sin(i * 1.3)) * 70}%` }} />
          ))}
        </div>
        <div className="funnel-audio-meta">0:47</div>
      </div>
    </div>
  );
}

function Timer() {
  const [seconds, setSeconds] = useState(10 * 60);
  useEffect(() => {
    const id = setInterval(() => setSeconds((s) => (s > 0 ? s - 1 : 0)), 1000);
    return () => clearInterval(id);
  }, []);
  const mm = String(Math.floor(seconds / 60)).padStart(2, "0");
  const ss = String(seconds % 60).padStart(2, "0");
  return (
    <div className="funnel-timer">
      DESCONTO LIBERADO: <strong>{mm}:{ss}</strong>
    </div>
  );
}

const WA_AVATAR = "https://i.imgur.com/pUwfPYm.jpg";
const WA_GALLERY = [
  "https://i.imgur.com/e5H9JpB.png",
  "https://i.imgur.com/amKy1N5.png",
  "https://i.imgur.com/fAcE7yY.png",
  "https://i.imgur.com/kGo2rH1.png",
];

export function Funnel() {
  const [step, setStep] = useState(1);
  const [answers, setAnswers] = useState<Record<number, string>>({});

  useEffect(() => {
    pushDataLayer("quiz_step", { step });
  }, [step]);

  const next = () => setStep((s) => Math.min(s + 1, TOTAL_STEPS));

  // Loading transition removed — step 14 advances immediately on button click.

  const pickAnswer = (questionIndex: number) => (value: string) => {
    setAnswers((a) => ({ ...a, [questionIndex]: value }));
    pushDataLayer("quiz_answer", { step, question: questionIndex, answer: value });
    setTimeout(next, 180);
  };

  const handleCheckout = () => {
    pushDataLayer("InitiateCheckout", { answers });
    window.location.href = "https://pay.cakto.com.br/f5b6zii_924930";
  };

  const content = useMemo(() => {
    switch (step) {
      case 1:
        return (
          <div className="funnel-step">
            <h1 className="funnel-title">
              Já tentou de tudo para emagrecer e sente que nada funciona para você?
            </h1>
            <p className="funnel-subtitle">
              Descubra, em 1 minuto, como esse "Mounjaro Natural" está ajudando a secar a barriga
              de milhares de mulheres já nos primeiros dias!
            </p>
            <button className="funnel-cta" onClick={next}>
              Quero controlar minha fome agora
            </button>
          </div>
        );
      case 2:
        return (
          <div className="funnel-step">
            <h2 className="funnel-question">Hoje, o que mais te incomoda no seu corpo?</h2>
            <QuizOptions
              options={[
                "😣 Barriga inchada",
                "🥲 Gordura localizada",
                "👗 Roupa não serve mais",
                "🚫 Não vejo resultado nunca",
              ]}
              onPick={pickAnswer(1)}
            />
          </div>
        );
      case 3:
        return (
          <div className="funnel-step">
            <h2 className="funnel-question">Você já tentou emagrecer antes?</h2>
            <QuizOptions
              options={[
                "🔄 Já tentei de tudo e não consegui",
                "📉 Emagreço e depois engordo tudo",
                "🏃‍♀️ Começo animada e desisto",
                "🛑 Nunca consegui manter constância",
              ]}
              onPick={pickAnswer(2)}
            />
          </div>
        );
      case 4:
        return (
          <div className="funnel-step">
            <h2 className="funnel-question">Qual sua maior dificuldade hoje?</h2>
            <QuizOptions
              options={[
                "🍫 Ansiedade / vontade de comer doce",
                "⏰ Falta de tempo",
                "🍔 Perco o controle e acabo comendo demais",
                "🐢 Metabolismo lento",
              ]}
              onPick={pickAnswer(3)}
            />
          </div>
        );
      case 5:
        return (
          <div className="funnel-step">
            <h2 className="funnel-question">Como você se sente hoje?</h2>
            <QuizOptions
              options={[
                "😞 Frustrada com meu corpo",
                "🥱 Cansada / sem energia",
                "🪞 Insegura com minha aparência",
                "😔 Desanimada comigo mesma",
              ]}
              onPick={pickAnswer(4)}
            />
          </div>
        );
      case 6:
        return (
          <div className="funnel-step">
            <h2 className="funnel-question">
              Pra fechar e entender melhor seus objetivos, qual dessas frases mais parece com você?
            </h2>
            <QuizOptions
              options={[
                "👖 Minhas roupas não servem mais como antes",
                "🫣 Evito me olhar no espelho porque não gosto do que vejo",
                "📸 Não me sinto mais à vontade pra tirar fotos porque minha autoestima está baixa",
                "👙 Tenho vergonha do meu corpo em roupas mais justas ou na praia",
                "🤷‍♀️ Não sei explicar, mas sei que não estou bem com meu corpo",
              ]}
              onPick={pickAnswer(5)}
            />
          </div>
        );
      case 7:
        return (
          <div className="funnel-step">
            <h2 className="funnel-title">
              Te interessa ter acesso a um método simples que já mostra resultado nos primeiros dias?
            </h2>
            <ul className="funnel-check-list">
              <li><Check />Protocolo de Mounjaro Natural que controla sua fome, reduz a vontade por doces e acelera o metabolismo desde os primeiros dias</li>
              <li><Check />Plano simples que você consegue seguir na rotina, sem dietas malucas</li>
              <li><Check />Guia de marmitas que te ajuda a não sair do controle no dia a dia</li>
              <li><Check />+380 receitas práticas pra não enjoar e continuar emagrecendo</li>
            </ul>
            <button className="funnel-cta" onClick={next}>Quero começar</button>
          </div>
        );
      case 8:
        return (
          <div className="funnel-step">
            <p className="funnel-text" style={{ textAlign: "center", fontWeight: 600 }}>
              Assista o vídeo abaixo
            </p>
            <VimeoEmbed id="1175595551" title="Vídeo de apresentação" />
            <p className="funnel-subtitle" style={{ textAlign: "center" }}>
              É super curto, fique tranquilo.
            </p>
            <button className="funnel-cta" onClick={next}>Vamos lá!</button>
          </div>
        );
      case 9:
        return (
          <div className="funnel-step">
            <h2 className="funnel-title">
              Mais de 100 mil mulheres já testaram esse método e tiveram resultados reais!
            </h2>
            <p className="funnel-text" style={{ textAlign: "center" }}>
              Olha o que aconteceu com a Luana: a calça dela voltou a servir em poucos dias 😳 E o melhor? Sem dieta maluca, só com um método natural!
            </p>
            <VimeoEmbed id="1123295105" title="Depoimento Luana" />
            <img width="100%" src="https://i.imgur.com/1Voc7Fn.png" alt="Depoimento" loading="lazy" />
            <VimeoEmbed id="1025502310" title="Depoimento" />
            <img width="100%" src="https://i.imgur.com/5qt2y86.png" alt="Depoimento" loading="lazy" />
            <img width="100%" src="https://i.imgur.com/U58IRnm.png" alt="Depoimento" loading="lazy" />
            <p className="funnel-text" style={{ textAlign: "center" }}>
              Clique no botão abaixo e veja como aplicar o mesmo plano na sua rotina:
            </p>
            <button className="funnel-cta" onClick={next}>QUERO MUDAR AGORA</button>
          </div>
        );
      case 10:
        return (
          <div className="funnel-step">
            <h2 className="funnel-title">
              O Segredo que já mudou a vida de mais de 100 mil mulheres comuns como você
            </h2>
            <p className="funnel-subtitle">
              Escuta esse áudio (é super rápido). Vou te contar como milhares de mulheres já
              conseguiram eliminar até 10kg em poucas semanas sem academia e sem dietas malucas.
            </p>
            <WhatsAppAudio avatarUrl={WA_AVATAR} />
            <div className="funnel-screenshot-gallery">
              {WA_GALLERY.map((url, i) => (
                <img
                  key={url}
                  src={url}
                  alt={`Depoimento ${i + 1}`}
                  style={{ width: "100%", display: "block", borderRadius: 8 }}
                  loading="lazy"
                />
              ))}
            </div>
            <p className="funnel-highlight" style={{ textAlign: "center", fontWeight: 700 }}>
              Fantástico né?
            </p>
            <button className="funnel-cta" onClick={next}>
              Quero esse resultado também!
            </button>
          </div>
        );
      case 11:
        return (
          <div className="funnel-step">
            <Battery
              percent={22}
              variant="low"
              label="22% de chance de emagrecer sozinha SEM o método ❌"
            />
            <Battery
              percent={96}
              variant="high"
              label="96% de chance de eliminar peso seguindo o método ✅"
            />
            <h2 className="funnel-title" style={{ fontSize: 22 }}>
              Você gostaria de estar no grupo das mulheres que têm 96% de chance de sucesso?
            </h2>
            <button className="funnel-cta" onClick={next}>Sim, claro que quero!</button>
          </div>
        );
      case 12:
        return (
          <div className="funnel-step">
            <VimeoEmbed id="1175543650" title="Vídeo da Lu" />
            <h2 className="funnel-title">
              A Lu eliminou 7 kg em apenas 30 dias com o Método Natural
            </h2>
            <p className="funnel-text">Sem academia, sem dietas malucas e sem sofrimento.</p>
            <p className="funnel-highlight">
              Agora me diz: já deu pra ver que esse método realmente funciona, né?
            </p>
            <button className="funnel-cta" onClick={next}>
              Sim, eu quero esse resultado pra mim!
            </button>
          </div>
        );
      case 13:
        return (
          <div className="funnel-step">
            <img
              width="100%"
              src="https://i.imgur.com/qDyLa9u.png"
              alt="Comparativo de Resultados — Sem o Chá vs Com o Chá"
              loading="lazy"
            />
            <h2 className="funnel-title">
              Agora que você viu a diferença, quer que eu te mostre como aplicar no seu dia a dia?
            </h2>
            <button className="funnel-cta" onClick={next}>Bora!</button>
          </div>
        );
      case 14:
        return (
          <div className="funnel-step">
            <h2 className="funnel-title">Perfeito. Você está no lugar certo!</h2>
            <img
              src={perfilCaroline.url}
              alt="Perfil Instagram — Caroline Rafasky · Emagrecimento"
              className="funnel-image"
              loading="lazy"
            />
            <p className="funnel-text">
              <strong>Depois de ajudar milhares de mulheres na prática...</strong> Eu percebi uma
              coisa: não é falta de força de vontade. A maioria só está seguindo o método errado.
            </p>
            <p className="funnel-text"><strong>Eu sei como é frustrante...</strong></p>
            <ul className="funnel-check-list">
              <li><Check />Tentar dieta e não ver resultado</li>
              <li><Check />Começar animada e desistir no meio</li>
              <li><Check />Se olhar no espelho e não se reconhecer</li>
            </ul>
            <p className="funnel-text">
              <strong>Foi exatamente por isso que desenvolvi</strong> um método simples, direto e
              fácil de seguir... Que funciona na vida real. Sem dieta maluca. Sem sofrimento.
            </p>
            <ul className="funnel-badge-list">
              <li>✅ Mais de 100 mil mulheres já tiveram resultados</li>
              <li>✅ Método testado e validado na prática</li>
              <li>✅ Resultados reais em poucas semanas</li>
            </ul>
            <button className="funnel-cta" onClick={next}>Quero começar agora</button>
          </div>
        );
      case 15:
        return (
          <div className="funnel-step">
            <p className="funnel-text" style={{ textAlign: "center", fontWeight: 600 }}>
              "O único 'problema' de usar o Mounjaro natural... Fui me arrumar pra sair, e nada mais me serve"
            </p>
            <VimeoEmbed id="1175561720" title="Depoimento final" />
            <button className="funnel-cta" onClick={next}>Desbloquear meu acesso</button>
          </div>
        );
      case 16:
        return (
          <div className="funnel-step">
            <Timer />
            <div className="funnel-alert">
              ATENÇÃO! Esta é a sua última chance de garantir acesso com todos os bônus e desconto especial.
            </div>
            <h2 className="funnel-title">
              Agora é com você: continuar como está ou começar a mudar de verdade
            </h2>
            <p className="funnel-text">
              Você já percebeu que não é falta de esforço. Só faltava o método certo. Agora você
              pode começar hoje e finalmente ver resultado de verdade.
            </p>
            <p className="funnel-highlight">
              Mais de 100 mil mulheres já começaram e estão vendo resultado com esse método.
              Agora é a sua vez.
            </p>
            <h3 className="funnel-section-title">Ao entrar hoje, você recebe acesso imediato a:</h3>
            <ul className="funnel-check-list">
              <li><Check />Protocolo de Mounjaro Natural que controla sua fome, reduz a vontade por doces e acelera o metabolismo desde os primeiros dias</li>
              <li><Check />Plano simples que você consegue seguir na rotina, sem dietas malucas</li>
              <li><Check />Guia de marmitas que te ajuda a não sair do controle no dia a dia</li>
              <li><Check />+380 receitas práticas pra não enjoar e continuar emagrecendo</li>
            </ul>
            <h3 className="funnel-bonus-title">★ Bônus Exclusivos — Só hoje:</h3>
            <ul className="funnel-check-list">
              <li><Check />Jantar Zero Açúcar, ideal pra quem quer perder peso sem sofrimento</li>
              <li><Check />Premiação de R$500 para o melhor resultado do mês</li>
              <li><Check />Acompanhamento exclusivo no Grupo do WhatsApp para te manter motivada e tirar todas as suas dúvidas!</li>
            </ul>
            <div className="funnel-price-box">
              <span className="funnel-price-old">De R$127</span>
              <span className="funnel-price-new">R$57</span>
              <span className="funnel-price-installments">
                à vista ou em até <strong>8x de R$8,29</strong> no cartão
              </span>
            </div>
            <div className="funnel-guarantee">
              <div className="funnel-guarantee-seal">RISCO<br />ZERO</div>
              <div className="funnel-guarantee-text">
                <strong>7 dias de garantia.</strong> Se não amar, devolvemos 100% do seu dinheiro.
                Sem letras miúdas.
              </div>
            </div>
            <button
              className="funnel-cta funnel-cta-pulse funnel-final-cta"
              onClick={handleCheckout}
            >
              QUERO MINHA TRANSFORMAÇÃO AGORA!
            </button>
          </div>
        );
      default:
        return null;
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [step]);

  return (
    <div className="funnel-root">
      <Progress step={step} />
      <main className="funnel-container">{content}</main>
      <Footer />
    </div>
  );
}
