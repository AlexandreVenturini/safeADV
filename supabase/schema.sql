create table public.advogados (
  codigo     text primary key check (codigo ~ '^SADV-[A-Z0-9]{5}$'),
  nome       text not null,
  oab        text not null,
  uf         char(2) not null,
  email      text,
  telefone   text,
  foto       text check (length(foto) < 300000),
  status     text not null default 'ativo' check (status in ('ativo', 'bloqueado')),
  fixo       boolean not null default false,
  criado_em  timestamptz not null default now(),
  unique (oab, uf)
);

alter table public.advogados enable row level security;

grant select on public.advogados to anon;
grant insert (codigo, nome, oab, uf, email, telefone, foto) on public.advogados to anon;
grant update (status) on public.advogados to anon;
grant delete on public.advogados to anon;

create policy "Qualquer pessoa pode consultar"
  on public.advogados for select to anon
  using (true);

create policy "Novos cadastros entram ativos e não fixos"
  on public.advogados for insert to anon
  with check (fixo = false and status = 'ativo');

create policy "Bloquear e reativar identificadores"
  on public.advogados for update to anon
  using (true) with check (true);

create policy "Apagar apenas cadastros da demonstração"
  on public.advogados for delete to anon
  using (fixo = false);

insert into public.advogados (codigo, nome, oab, uf, email, telefone, status, fixo) values
  ('SADV-7K3P9', 'Dra. Mariana Lopes Ferreira', '123456', 'ES', 'mariana.ferreira@exemplo.adv.br', '(27) 90000-1234', 'ativo', true),
  ('SADV-R8M4T', 'Dr. Carlos Eduardo Nogueira', '654321', 'SP', 'carlos.nogueira@exemplo.adv.br', '(11) 90000-5678', 'ativo', true),
  ('SADV-B4X2N', 'Dr. Ricardo Almeida Santos', '987654', 'ES', 'ricardo.santos@exemplo.adv.br', '(27) 90000-9876', 'bloqueado', true);
