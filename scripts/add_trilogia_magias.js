const fs = require('fs');
const path = './src/data/magias/magias.json';

const magias = JSON.parse(fs.readFileSync(path, 'utf8'));

const novasMagias = [
  {
    id: 'emanacoes_de_paz',
    nome: 'Emanações de Paz',
    nivel: 1,
    tipo: 'divina',
    escola: 'Encantamento',
    tempoExecucao: 'Ação padrão',
    alcance: '9m',
    alvoAreaEfeito: 'Todos os inimigos dentro do alcance',
    duracao: '1 minuto',
    resistencia: 'Vontade anula',
    descricao: 'A postura serena do conjurador faz com que os inimigos hesitem, sofrendo uma penalidade de -2 nas jogadas de ataque.'
  },
  {
    id: 'sonho_de_dor',
    nome: 'Sonho de Dor',
    nivel: 8,
    tipo: 'arcana',
    escola: 'Ilusão',
    tempoExecucao: 'Ação padrão',
    alcance: '9m',
    alvoAreaEfeito: 'Emanação com 9m de raio',
    duracao: '1 minuto',
    resistencia: 'Vontade parcial',
    descricao: 'No início de cada rodada, cada inimigo dentro da área é atingido por dores terríveis, sofrendo 4d8 pontos de dano e uma penalidade de -4 em jogadas de ataque e testes de habilidade, perícia e resistência até o início de seu próximo turno. Um teste de Vontade bem-sucedido reduz o dano à metade e evita a penalidade. Entretanto, o dano é ilusório, e desaparece no fim da duração da magia. Uma criatura que tenha caído inconsciente pelo dano acorda dentro de uma hora.'
  }
];

let addedCount = 0;
for (const m of novasMagias) {
  if (!magias.some(existing => existing.id === m.id)) {
    magias.push(m);
    addedCount++;
  }
}

fs.writeFileSync(path, JSON.stringify(magias, null, 2), 'utf8');
console.log(`Magias adicionadas: ${addedCount}. Total: ${magias.length}`);
