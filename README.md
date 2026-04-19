# 💖 nossohistoria.love

Plataforma para vender páginas românticas personalizadas. Cliente cria o site,
paga via Mercado Pago (PIX / cartão), e recebe um link exclusivo vitalício.

## Stack

- **Frontend**: Vite + React 18 + TypeScript + Tailwind 4 + Framer Motion
- **Backend**: Supabase (Postgres + Storage + Auth + Edge Functions em Deno)
- **Pagamentos**: Mercado Pago Checkout Pro (PIX + cartão)
- **Hospedagem**: Vercel (frontend) + Supabase (backend) — free tier para começar

## Estrutura

```
src/
  app/
    App.tsx                  # Roteador (react-router)
    pages/
      Landing.tsx            # /
      Create.tsx             # /criar (formulário multi-step)
      Checkout.tsx           # /checkout/:draftId
      Success.tsx            # /sucesso/:draftId (polling pagamento)
      LoveSite.tsx           # /love/:slug (site público)
      Demo.tsx               # /demo (site exemplo)
      admin/
        Login.tsx            # /admin/login
        Dashboard.tsx        # /admin
        Payments.tsx         # /admin/payments
        Sites.tsx            # /admin/sites
    components/
      site/SiteTemplate.tsx  # Template que renderiza o site do casal
      site/SiteContext.tsx   # Contexto com os dados do casal
      form/*.tsx             # Campos, upload, preview mini, tema
      admin/*.tsx            # Layout e proteção admin
      HeroSection.tsx, GallerySection.tsx, etc.  # Seções do site (data-driven)
  lib/
    types.ts                 # LoveData, Draft, Payment, Theme, PRICE_BRL
    supabase.ts              # Client Supabase + helpers de URL de foto
    api.ts                   # submitDraft, getDraft, createPayment, etc.
    slug.ts                  # geração de slug + contador de dias
    demoData.ts              # dados do exemplo Guilherme & Brenda
    draftStorage.ts          # rascunho local (localStorage)
supabase/
  migrations/001_init.sql    # schema + RLS + bucket de fotos + view de stats
  functions/
    create-payment/index.ts  # Edge Function: cria preferência MP
    mp-webhook/index.ts      # Edge Function: recebe webhook e libera site
```

## Rodar localmente

```bash
npm install
cp .env.example .env     # edite com suas chaves do Supabase
npm run dev              # http://localhost:5173
```

## Deploy

Ver **[DEPLOY.md](DEPLOY.md)** — passo a passo de ~20 minutos para:
1. Criar projeto no Supabase (2 min)
2. Rodar SQL + subir Edge Functions (5 min)
3. Configurar secrets Mercado Pago (3 min)
4. Fazer deploy no Vercel (5 min)
5. Configurar webhook Mercado Pago (2 min)
6. Criar usuário admin (2 min)

## Fluxo do produto

1. Visitante acessa `/`, clica em "Criar meu site"
2. Preenche formulário em `/criar` (nomes, fotos, história, música, tema)
3. Ao enviar, fotos sobem pro Supabase Storage e draft é criado (`status=pending`)
4. Vai pra `/checkout/:draftId`, clica em pagar → Edge Function cria preferência no Mercado Pago
5. Mercado Pago processa (PIX ou cartão) e redireciona pra `/sucesso/:draftId`
6. Em paralelo, webhook `mp-webhook` recebe confirmação, atualiza pagamento e muda draft pra `status=paid`
7. Página de sucesso faz polling e mostra o link `/love/:slug`
8. Cliente acessa o link único quando quiser — fica pra sempre

## Preço

Definido em `src/lib/types.ts` → `PRICE_BRL = 19.9` e na env `PRICE_BRL` das Edge Functions.
