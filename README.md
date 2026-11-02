# Meu espaço

Portal pessoal estático, protegido por criptografia, para GitHub Pages.

## Como funciona

O catálogo completo e a interface ficam em um único payload AES-256-GCM. A chave é derivada da senha com PBKDF2-SHA256, 600.000 iterações, salt aleatório de 128 bits e IV aleatório de 96 bits a cada build. O GitHub Pages entrega apenas a tela de acesso e os dados criptografados. A senha e a chave de conteúdo não ficam no HTML ou no repositório. A opção “Lembrar acesso neste navegador” salva no IndexedDB um CryptoKey PBKDF2 não exportável, permitindo desbloquear o catálogo nas próximas visitas sem armazenar a senha em texto aberto. Esse acesso permanece até usar “Bloquear e esquecer” ou limpar os dados do site. Sem selecionar essa opção, recarregar bloqueia o acesso. O formulário também identifica os campos para gerenciadores de senhas do navegador.

Isso protege o catálogo com a força da senha; não é autenticação de servidor. Quem baixar o arquivo poderá tentar adivinhar a senha offline. A senha deve ser longa, aleatória e exclusiva. Trocar a senha não revoga cópias antigas já baixadas. Os destinos dos links mantêm suas próprias permissões.

## Atualizar o catálogo

Requer Node 22+ e GitHub CLI autenticado com leitura dos repositórios do proprietário.

```sh
npm run sync
```

O comando consulta todas as páginas de repositórios da conta, incluindo privados, e obtém URLs reais na API do GitHub Pages. A data exibida é `pushed_at` (último push ao repositório), e não a data de publicação da ferramenta. O rodapé informa a data de sincronização do catálogo. Datas são exibidas em America/Sao_Paulo. A sincronização é manual; uma nova atualização exige gerar e publicar outro build.

Links de ferramentas fora do GitHub e nomes personalizados podem ser cadastrados em `.local/links.json`, ignorado pelo Git. Formato:

```json
{"repositories":{"nome-do-repo":{"name":"Nome na interface","site":"https://exemplo.com"}},"sites":[{"name":"Ferramenta","description":"Descrição","site":"https://exemplo.com","private":true,"publishedAt":"2026-11-02T12:00:00Z"}]}
```

O build requer `PORTAL_PASSWORD` no ambiente ou a senha via stdin em `node scripts/build-from-stdin.mjs`. Não escreva a senha no comando ou no histórico do shell. Apenas `dist/` deve ser publicado. Nunca publique `.local/`, `.inventory-local.json` ou o catálogo em texto aberto. O código-fonte pode ser público.

## Hospedagem

O branch `main` guarda o código sem dados privados. O branch `gh-pages` contém apenas `index.html` criptografado e `.nojekyll`, servido em https://oviniciusramosp.github.io/personal-hub/.

Suporte: hello@viniciusramos.com

## Categorias

A interface agrupa os projetos em Crypto Bros, Paradigma, Apps Web, Apps Mobile, Vision OS e Outros. A busca e os filtros de publicação e privacidade funcionam dentro de cada categoria. As regras usam nomes dos projetos; `category` em uma entrada do catálogo pode sobrescrever a classificação.
