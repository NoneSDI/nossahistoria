# 🚀 Guia de deploy — nossohistoria.love

Tempo estimado: **~20 minutos**. Custo: **R$ 0** no free tier.

## Pré-requisitos

- Conta no [Supabase](https://supabase.com) (grátis)
- Conta no [Vercel](https://vercel.com) (grátis)
- Conta no [Mercado Pago](https://www.mercadopago.com.br/developers) (grátis)
- Conta no [GitHub](https://github.com) (grátis) — pra conectar o Vercel
- [Node.js 18+](https://nodejs.org) e [Supabase CLI](https://supabase.com/docs/guides/local-development/cli/getting-started) instalados

---

## Fase 1 — Supabase (5 min)

### 1.1 Criar projeto

1. Acesse [supabase.com/dashboard](https://supabase.com/dashboard) → **New project**
2. Nome: `nossohistoria`, região: **South America (São Paulo)**
3. Gere uma senha forte para o banco e salve
4. Aguarde ~2 min até o projeto ficar pronto

### 1.2 Rodar o SQL

1. No menu lateral: **SQL Editor** → **New query**
2. Cole o conteúdo de [`supabase/migrations/001_init.sql`](supabase/migrations/001_init.sql)
3. Clique em **Run** — deve dizer *Success. No rows returned*

Isso cria:
- Tabelas `drafts`, `payments`, `admins`
- Políticas de RLS
- Bucket público `photos`
- View `admin_stats`

### 1.3 Pegar as chaves

Menu lateral → **Settings** → **API**:
- `Project URL` → vai ser `VITE_SUPABASE_URL`
- `anon public` key → vai ser `VITE_SUPABASE_ANON_KEY`
- `service_role` key → **só usada nas Edge Functions** (nunca exponha no frontend)

---

## Fase 2 — Edge Functions + Mercado Pago (8 min)

### 2.1 Login na Supabase CLI

```bash
npx supabase login
npx supabase link --project-ref SEU_PROJECT_REF
```

(O `project-ref` tá na URL do painel: `https://supabase.com/dashboard/project/<REF>`)

### 2.2 Configurar os secrets das Edge Functions

```bash
npx supabase secrets set \
  MP_ACCESS_TOKEN="TEST-3950221133860693-041820-9a9a275a317d9fe21ebc90027ac90428-1030084514" \
  PUBLIC_SITE_URL="https://seu-dominio.vercel.app" \
  PRICE_BRL="19.90"
```

> ⚠️ **Troque o `MP_ACCESS_TOKEN`** quando for pra produção pelo token `APP_USR-...` real do Mercado Pago, e atualize o `PUBLIC_SITE_URL` com seu domínio definitivo.

### 2.3 Subir as Edge Functions

```bash
npx supabase functions deploy create-payment --no-verify-jwt
npx supabase functions deploy mp-webhook --no-verify-jwt
```

> `--no-verify-jwt` é necessário porque o webhook do Mercado Pago não manda JWT.

As URLs serão:
- `https://SEU_PROJECT_REF.supabase.co/functions/v1/create-payment`
- `https://SEU_PROJECT_REF.supabase.co/functions/v1/mp-webhook`

---

## Fase 3 — Deploy no Vercel (5 min)

### 3.1 Subir pro GitHub

```bash
cd site_brenda
git init
git add .
git commit -m "feat: plataforma nossohistoria.love"
gh repo create nossohistoria --public --source=. --push   # ou crie pelo GitHub web
```

### 3.2 Importar no Vercel

1. Acesse [vercel.com/new](https://vercel.com/new)
2. **Import Git Repository** → selecione seu repo
3. Framework preset: **Vite** (detectado automaticamente)
4. Em **Environment Variables**, adicione:
   - `VITE_SUPABASE_URL` = `https://SEU_PROJECT_REF.supabase.co`
   - `VITE_SUPABASE_ANON_KEY` = sua anon key
5. **Deploy**

Em 1-2 minutos você terá um domínio `*.vercel.app`. Copie ele.

### 3.3 Atualizar `PUBLIC_SITE_URL` nas Edge Functions

```bash
npx supabase secrets set PUBLIC_SITE_URL="https://SEU-DOMINIO.vercel.app"
```

(Redeploy não é necessário — secrets são lidos em tempo de execução.)

---

## Fase 4 — Webhook Mercado Pago (2 min)

1. Acesse [painel do Mercado Pago Developers](https://www.mercadopago.com.br/developers/panel/app) → sua aplicação
2. Menu lateral: **Webhooks** → **Configurar notificações**
3. Modalidade: **Webhook**
4. URL de produção (e a de teste também):  
   `https://SEU_PROJECT_REF.supabase.co/functions/v1/mp-webhook`
5. Eventos: marque ✅ **Pagamentos**
6. Salve

Pronto — o Mercado Pago vai mandar notificação toda vez que um pagamento mudar de status.

> A Edge Function `create-payment` já seta o `notification_url` na preferência, então mesmo sem essa configuração global o webhook funciona. Configurar aqui é um backup.

---

## Fase 5 — Criar usuário admin (2 min)

### 5.1 Criar a conta no Supabase Auth

Menu lateral no Supabase: **Authentication** → **Users** → **Add user** → **Create new user**

- E-mail: `thayla@b42.com.br` (ou o que você preferir)
- Senha: defina uma senha forte
- Marque **Auto Confirm User**

### 5.2 Promover a conta a admin

SQL Editor → nova query:

```sql
insert into public.admins (user_id, email)
select id, email from auth.users where email = 'thayla@b42.com.br';
```

### 5.3 Acessar

Acesse `https://SEU-DOMINIO.vercel.app/admin/login` e entre. 🎉

---

## Testando o fluxo completo

1. Abra `/` → clique em **Criar meu site**
2. Preencha tudo (pode usar cartão de teste do Mercado Pago)
3. Na tela de pagamento, use um [cartão de teste](https://www.mercadopago.com.br/developers/pt/docs/checkout-api/additional-content/your-integrations/test/cards):
   - **APROVADO**: `5031 4332 1540 6351`, CVV `123`, val `11/30`, nome `APRO`
   - **RECUSADO**: nome `OTHE`
4. Após pagar, volta pra `/sucesso/:id` → link do site aparece em alguns segundos
5. Confere no `/admin` que o pagamento apareceu

---

## Indo pra produção (quando começar a vender de verdade)

1. **Credenciais Mercado Pago**: troque de `TEST-...` pro token `APP_USR-...` da sua aplicação em produção
2. **Domínio próprio**: aponte um domínio (`.com.br` ou `.love`) no Vercel. Atualize `PUBLIC_SITE_URL` nas Edge Functions
3. **Regenere a chave** que você expôs no chat antes de vender de verdade (Mercado Pago permite reset)
4. **E-mail transacional**: opcional, mas ajuda — use [Resend](https://resend.com) ou Supabase Auth hooks pra mandar o link por e-mail depois do pagamento. Hoje o cliente recebe na tela `/sucesso/:id`

---

## Troubleshooting

**"Supabase não está configurado"** → falta `VITE_SUPABASE_URL` / `VITE_SUPABASE_ANON_KEY` no `.env` (local) ou no Vercel (prod).

**Webhook não dispara** → entra no painel do Mercado Pago > Webhooks > Histórico. Se os requests estão saindo, olhe os **Logs** da Edge Function no Supabase (*Functions* > *mp-webhook* > *Logs*).

**Upload de foto falhando** → confere o bucket `photos` no Supabase Storage e se o SQL das políticas rodou.

**Admin não consegue entrar** → confere se rodou o `insert into public.admins` com o e-mail certo.
