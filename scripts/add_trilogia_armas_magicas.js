const fs = require('fs');
const path = './src/data/regras/armas_magicas.json';

const armasMagicas = JSON.parse(fs.readFileSync(path, 'utf8'));

const novosPoderes = [
  {
    id: 'poder_armadura_absorcao',
    nome: 'Poder Especial: Absorção',
    tipo: 'Armas Mágicas',
    subtipo: 'Armaduras e Escudos',
    bonusEquivalente: '+4',
    descricao: 'Uma armadura ou escudo com este poder é cinzenta e opaca. Fornece ao usuário resistência 10 a todos os tipos de energia (ácido, eletricidade, fogo, frio e sônico). Além disso, se o usuário for alvo de uma magia prejudicial, há 25% de chance de que a magia não tenha efeito.',
    detalhes: 'Aura moderada; Criar Armas e Armaduras Mágicas, resistência a energia, resistência a magia; Preço +4 de bônus.',
    livroFonte: 'Guia da Trilogia'
  },
  {
    id: 'arma_especifica_wakizashi_da_morte',
    nome: 'Arma Específica: Wakizashi da Morte',
    tipo: 'Armas Mágicas',
    subtipo: 'Armas Específicas',
    bonusEquivalente: '+1',
    descricao: 'Esta espada curta tradicional de Tamu-ra costuma ser entregue ao Executor Imperial — ou, em raríssimos casos, a outros guerreiros valorosos. A wakizashi da morte tem apenas +1 de bônus numérico, mas seu poder real é muito mais impressionante.',
    detalhes: '• Qualquer criatura inteligente que veja seu reflexo na lâmina da wakizashi irá enxergar o momento de sua própria morte, vendo a si mesma "de fora".\n• Um personagem que enxergue sua morte tem um bônus de +2 em CA e testes de resistência em qualquer combate antes do momento fatídico.\n• No encontro que levará à sua morte, sofre -4 em CA e testes de resistência, e todos os acertos contra ele são considerados críticos. Tudo conspira para que a profecia se cumpra.\n• Aura poderosa.',
    livroFonte: 'Guia da Trilogia'
  }
];

let added = 0;
for (const item of novosPoderes) {
  if (!armasMagicas.some(x => x.id === item.id)) {
    armasMagicas.push(item);
    added++;
  }
}

fs.writeFileSync(path, JSON.stringify(armasMagicas, null, 2), 'utf8');
console.log(`Poderes/Itens em armas_magicas adicionados: ${added}. Total: ${armasMagicas.length}`);

