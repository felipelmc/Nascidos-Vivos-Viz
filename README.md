[![Review Assignment Due Date](https://classroom.github.com/assets/deadline-readme-button-24ddc0f5d75046c5622901739e7c5dd533143b0c8e959d652212380cedb1ea36.svg)](https://classroom.github.com/a/CxFZefIP)

## Relatório 

### Introdução

A visualização proposta pelo grupo se baseia no princípio de *onboarding*, que é a prática de, justamente, fazer com que o usuário embarque na visualização e interaja com ela de forma intuitiva. A própria base de dados escolhida para este projeto parte dessa ideia prévia: optamos por trabalhar com dados que possibilitem que o usuário localize a si próprio ou obtenha dados de seu interesse. 

Utilizamos dados oriundos do Sistema de Informações sobre Nascidos Vivos (SINASC), que é um sistema de informação desenvolvido pelo Ministério da Saúde para a coleta de dados sobre nascidos vivos no Brasil. O objetivo era que o usuário pudesse visualizar dados sobre nascidos vivos nas cidades fluminenses ao longo do tempo, principalmente no que diz respeito às distribuições do apgar1, que é um índice que mede a vitalidade do recém-nascido. A visualização permite não só que o usuário visualize os dados de forma geral, mas também execute filtros mais específicos (como por ano, cidade, sexo, idade da mãe na ocasião do nascimento e outras variáveis) e obtenha informações mais detalhadas.

A base foi acessada por intermédio da Base dos Dados e o pipeline utilizado para realizar o download e a limpeza/manipulação dos dados está nos arquivos `DataDownload.ipynb` e `DataWrangling.ipynb`, respectivamente.

A manipulação dos dados envolveu, principalmente, a remoção de *outliers* da coluna de apgar1, que era o principal objeto de visualização. Como se trata de um índice que varia entre 0 e 10, removemos todos os valores que não estavam nesse intervalo. 

Além disso, para trabalhar com os dados de forma mais eficiente, partimos o dataset em várias partes, um para cada ano, de forma que o tamanho de cada arquivo pudesse ser comportado no GitHub. Inclusive, como os arquivos precisavam estar públicos para os testes de visualização realizados localmente, hospedamos os dados do trabalho neste [outro repositório](https://github.com/felipelmc/Nascidos-Vivos-Viz).

### Justificativas para as decisões de design

A visualização é dividida em duas partes: a primeira é um mapa que mostra o Apgar 1 médio por município ao longo do tempo, e a segunda é um gráfico de barra que mostra a distribuição do Apgar 1 para o ano e cidade selecionados, podendo também ser fitrado por outras variáveis. Vamos discutir cada uma dessas partes separadamente:

#### Mapa

O mapa foi escolhido como a primeira parte da visualização por ser uma forma de apresentar os dados de forma geral, permitindo que o usuário tenha uma noção de como os dados estão distribuídos geograficamente. Além disso, o mapa permite que o usuário selecione uma cidade e um ano, e essas informações são passadas para a segunda parte da visualização, que é o gráfico de barras.

O mapa possui uma série de funcionalidades que permitem que o usuário intereja de forma intuitiva. A implementação do mapa envolve uma *scrollbar* e um botão de "Iniciar", que possibilita que o usuário veja a evolução do Apgar 1 médio ao longo do tempo em cada município, ou apenas visualizar um ano de seu interesse. Além disso, o mapa possui um *tooltip* que mostra o nome do município e o Apgar 1 médio naquele ano. Ao sobrepor o município com o mouse, o município fica destacado dos demais e o *tooltip* aparece. Ainda assim, o objetivo principal do mapa é possibilitar que o usuário possa filtrar a cidade de seu interesse para a visualização seguinte, que é o gráfico de barras que permite uma análise mais detalhada e interativa na medida em que o usuário pode selecionar valores de interesse para as variáveis.

A implementação do *scrollbar* foi uma sugestão que recebemos de um dos *peer critique*. Acreditamos que a funcionalidade transmite de forma mais intuitiva a ideia de passagem do tempo, ao invés do *drop down* apresentado no MVP. Também acatamos a ideia de modificar o subtítulo do gráfico, indicando mais especificamente do que se trata a visualização.

A ideia de implementar um *brush* no mapa foi descartada pelo grupo por acreditarmos que a funcionalidade não seria útil para o usuário. Além disso, também não implementamos a funcionalidade de expandir o mapa ao clicar em um município, pois acreditamos que não haveria ganho de informação. Outra sugestão que recebemos foi de adicionar um *pop-up* para evitar sobrecarregar a visualização com informações textuais. Acatamos essa sugestão e o *pop-up* foi implementado.

Naturalmente, o mapa também possui uma escala de cores que indica o Apgar 1 médio. Como se observa no mapa, a maior parte dos índices fica em faixas maiores, o que sugeriu a ideia de uma escala de cores que fosse apenas do 5 ao 10, e não de 0 a 10. Essa implementação foi testada e não foi adotada pelo grupo por acreditarmos que não havia ganho de informação suficiente para justificar a mudança. Em particular, acreditamos que a escala de cores de 0 a 10 permite que o usuário tenha uma noção melhor da distribuição dos dados. 

Uma sugestão que recebemos foi de aplicar alguma manipulação à escala do gráfico para reforçar as diferenças entre os municípios. O grupo optou por não adotar essa sugestão por acreditar que, considerando o público alvo da visualização, uma mudança na escala poderia dificultar a leitura e tornar a interatividade pouco intuitiva. Além disso, o Índice de Apgar é pensado para ser um índice simples que varia entre 0 e 10, e acreditamos que uma mudança na escala poderia gerar confusão.

Para passar a detalhar mais a implementação do gráfico de barras, é importante apontar a interação com o mapa: o usuário pode selecionar o município e um ano, e essas informações são passadas para o gráfico de barra. O ano é selecionado no *scroll*, e o município é selecionado ao clicar no mapa. Essas informações estão detalhadas para o usuário no *pop-up* "Informações", no canto superior esquerdo da tela. Ao selecionar o município com um *click*, o usuário é direcionado para o gráfico de barras.

#### Gráfico de barras

O gráfico de barras foi uma escolha natural para a segunda parte da visualização, justamente por permitir apresentar dados de contagem de forma intuitiva. Nesse caso, o gráfico mostra quantas crianças nasceram com cada índice de Apgar no ano e cidade selecionados. 

Aqui entram mais fortes os aspectos de *onboarding* da visualização. Permitimos que o usuário informe alguns dados sobre si mesmo (ou qualquer bebê que deseje encontrar o índice) e, a partir dessas informações, o gráfico de barras vai sendo filtrado. A filtragem ocorre à medida que o usuário informa cada um dos campos, e não somente quando completa todos eles. Por exemplo, se o usuário informa que é do sexo masculino, o gráfico de barras mostra apenas os dados de nascidos vivos do sexo masculino naquela cidade e ano. O mesmo vale para a idade da mãe, o tipo de parto, o peso do bebê e a data de nascimento. Caso o usuário informe todas essas informações e o gráfico de barras apresente apenas um valor, o usuário encontrou o índice de Apgar do bebê que procurava - nesse caso, surge um *pop-up* na tela do usuário informando que ele encontrou o que procurava.

Tendo filtrado todos os campos que desejava, o usuário pode voltar ao mapa e trocar o município, por exemplo.

A interatividade é explicada no *pop-up* localizado no canto superior esquerdo da tela, que tem um conteúdo diferente quando o usuário está na segunda parte da página. Quando o usuário clicou nesse *pop-up*, na primeira página, ainda observando o mapa, o texto solicita que ele clique ali novamente na página seguinte. 

### Visão geral do processo de desenvolvimento

A divisão de tarefas do grupo foi equitativa e todos os membros participaram de praticamente todas as fases do trabalho. Felipe Lamarca foi inicialmente o responsável pela gestão dos dados utilizados no projeto, enquanto Ana Carolina Erthal e Guilherme de Melo foram responsáveis pela implementação do mapa. Posteriormente, quando os dados estavam prontos para serem utilizados, todos os membros se debruçaram na implementação de ambos os gráficos, a integração entre eles e os eventuais ajustes à medida que o trabalho se desenvolvia. 

O grupo se reuniu semanalmente para discutir o andamento do projeto e as decisões de design. Além disso, o grupo se comunicou diariamente por meio do WhatsApp, para discutir eventuais dúvidas e compartilhar o andamento do trabalho. O tempo em horas para a realizaçao do trabalho foi de aproximadamente 25 horas por membro. A parte inicial do trabalho, principalmente a ambientação com aspectos mais complexos de D3.js, foi a que demandou mais tempo. Destaca-se, em particular, a implementação do mapa e dos filtros.

### Fontes

- [D3.js](https://d3js.org/)
- [Microdados do SINASC](https://basedosdados.org/dataset/br-ms-sinasc?bdm_table=microdados&bdm_dataset_name=br_ms_sinasc)
- [Base dos Dados](https://basedosdados.org/)