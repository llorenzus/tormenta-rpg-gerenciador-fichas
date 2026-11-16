import React, { useMemo, useState } from 'react';
import {
  FlatList,
  Modal,
  Platform,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import {
  CATEGORIAS_TALENTO,
  CategoriaTalento,
  ClasseData,
  classes,
  converterArmaParaItem,
  converterArmaduraParaItem,
  converterItemGeralParaItem,
  converterMagiaParaItem,
  converterTalentoParaItem,
  converterManobraParaItem,
  EquipamentoData,
  equipamentos,
  ESCOLAS_MAGIA,
  filtrarClasses,
  filtrarEquipamentos,
  filtrarMagias,
  filtrarRacas,
  filtrarTalentos,
  filtrarCondicoes,
  filtrarManobras,
  filtrarRegras,
  formatarDescricaoMagia,
  formatarDescricaoTalento,
  MagiaData,
  magias,
  RacaData,
  racas,
  TalentoData,
  talentos,
  identificarTalentosCitadosEmPreRequisitos,
  verificarPreRequisitosCumpridos,
  TipoEquipamento,
  TIPOS_EQUIPAMENTO,
  TIPOS_REGRA,
  TipoRegraFiltro,
  condicoes,
  todasRegras,
  posturas,
  golpesMarciais,
  CondicaoData,
  RegraData,
  PosturaData,
  GolpeMarcialData,
} from '../data';
import { FichaPersonagem, gerarId, HabilidadeOuTalento, obterClassesFicha, aplicarClasseNaFicha } from '../models/ficha';
import { COLORS } from '../theme/colors';
import { abrirCompendioEmJanelaSeparada } from '../utils/janelaCompendio';

export type AbaCompendio =
  | 'talentos'
  | 'magias'
  | 'racas'
  | 'classes'
  | 'equipamentos'
  | 'manobras'
  | 'regras';

export type ItemCompendio =
  | { tipo: 'talento'; dado: TalentoData }
  | { tipo: 'magia'; dado: MagiaData }
  | { tipo: 'raca'; dado: RacaData }
  | { tipo: 'classe'; dado: ClasseData }
  | { tipo: 'equipamento'; dado: EquipamentoData }
  | { tipo: 'manobra'; dado: PosturaData | GolpeMarcialData };

interface Props {
  visivel: boolean;
  onFechar: () => void;
  abaInicial?: AbaCompendio;
  nivelFiltroInicial?: number | null;
  categoriaInicial?: CategoriaTalento | 'Todas';

  // Quando acionado a partir de uma ficha aberta:
  fichaAtual?: FichaPersonagem | null;
  onAtualizarFichaAtual?: (novaFicha: FichaPersonagem) => void;
  onAdicionarTalentoAFicha?: (talento: TalentoData) => void;
  onAdicionarMagiaAFicha?: (magia: MagiaData) => void;
  onAplicarRacaAFicha?: (raca: RacaData) => void;
  onAplicarClasseAFicha?: (classe: ClasseData) => void;
  onAdicionarEquipamentoAFicha?: (equip: EquipamentoData) => void;
  onAdicionarManobraAFicha?: (manobra: PosturaData | GolpeMarcialData) => void;

  // Quando acionado da lista de fichas (selecionador de personagem):
  todasFichas?: FichaPersonagem[];
  onAdicionarItemParaFichaEspecifica?: (
    fichaId: string,
    tipo: 'talento' | 'magia' | 'raca' | 'classe' | 'equipamento' | 'manobra',
    item: TalentoData | MagiaData | RacaData | ClasseData | EquipamentoData | PosturaData | GolpeMarcialData
  ) => void;
  standalone?: boolean;
}

export const CompendioModal: React.FC<Props> = ({
  visivel,
  onFechar,
  abaInicial = 'talentos',
  nivelFiltroInicial = null,
  categoriaInicial = 'Todas',
  fichaAtual,
  onAtualizarFichaAtual,
  onAdicionarTalentoAFicha,
  onAdicionarMagiaAFicha,
  onAplicarRacaAFicha,
  onAplicarClasseAFicha,
  onAdicionarEquipamentoAFicha,
  onAdicionarManobraAFicha,
  todasFichas = [],
  onAdicionarItemParaFichaEspecifica,
  standalone = false,
}) => {
  const [abaAtiva, setAbaAtiva] = useState<AbaCompendio>(abaInicial);
  const [busca, setBusca] = useState('');

  // Filtros de Talentos
  const [categoriaSel, setCategoriaSel] = useState<CategoriaTalento | 'Todas'>(
    categoriaInicial
  );
  const [apenasRequisitosCumpridos, setApenasRequisitosCumpridos] = useState(false);
  const [talentoDetalheModal, setTalentoDetalheModal] = useState<TalentoData | null>(null);

  // Filtros de Magias
  const [nivelSel, setNivelSel] = useState<number | null>(nivelFiltroInicial);
  const [tipoMagiaSel, setTipoMagiaSel] = useState<'Todas' | 'Arcana' | 'Divina'>('Todas');
  const [escolaSel, setEscolaSel] = useState<string>('Todas');

  // Filtros de Classes
  const [tipoClasseSel, setTipoClasseSel] = useState<'Todas' | 'Basica' | 'Prestigio'>('Todas');

  // Filtros de Equipamentos
  const [tipoEquipSel, setTipoEquipSel] = useState<'Todos' | TipoEquipamento>('Todos');

  // Filtros de Manobras (Posturas e Golpes)
  const [tipoManobraSel, setTipoManobraSel] = useState<'Todas' | 'Postura' | 'Golpe Marcial'>('Todas');

  // Filtros de Regras (Condições, Pontos de Ação, Armas Mágicas)
  const [tipoRegraSel, setTipoRegraSel] = useState<TipoRegraFiltro>('Todas');

  // Controle de cards expandidos
  const [expandidos, setExpandidos] = useState<Record<string, boolean>>({});

  // Modal para escolher personagem caso estejamos na tela geral
  const [itemParaAdicionar, setItemParaAdicionar] = useState<ItemCompendio | null>(null);

  // Atualiza estado ao abrir com valores iniciais se mudarem
  React.useEffect(() => {
    if (visivel) {
      setAbaAtiva(abaInicial);
      if (nivelFiltroInicial !== undefined) setNivelSel(nivelFiltroInicial);
      if (categoriaInicial !== undefined) setCategoriaSel(categoriaInicial);
    }
  }, [visivel, abaInicial, nivelFiltroInicial, categoriaInicial]);

  const alternarExpandido = (id: string) => {
    setExpandidos((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  // Listas filtradas
  const talentosFiltrados = useMemo(() => {
    if (abaAtiva !== 'talentos') return [];
    let lista = filtrarTalentos({ termo: busca, categoria: categoriaSel });
    if (apenasRequisitosCumpridos && fichaAtual) {
      lista = lista.filter((t) => verificarPreRequisitosCumpridos(fichaAtual, t).cumpre);
    }
    return lista;
  }, [abaAtiva, busca, categoriaSel, apenasRequisitosCumpridos, fichaAtual]);

  const magiasFiltradas = useMemo(() => {
    if (abaAtiva !== 'magias') return [];
    return filtrarMagias({
      termo: busca,
      nivel: nivelSel,
      tipo: tipoMagiaSel,
      escola: escolaSel,
    });
  }, [abaAtiva, busca, nivelSel, tipoMagiaSel, escolaSel]);

  const racasFiltradas = useMemo(() => {
    if (abaAtiva !== 'racas') return [];
    return filtrarRacas(busca);
  }, [abaAtiva, busca]);

  const classesFiltradas = useMemo(() => {
    if (abaAtiva !== 'classes') return [];
    return filtrarClasses(busca, tipoClasseSel);
  }, [abaAtiva, busca, tipoClasseSel]);

  const equipamentosFiltrados = useMemo(() => {
    if (abaAtiva !== 'equipamentos') return [];
    return filtrarEquipamentos(busca, tipoEquipSel);
  }, [abaAtiva, busca, tipoEquipSel]);

  const manobrasFiltradas = useMemo(() => {
    if (abaAtiva !== 'manobras') return [];
    return filtrarManobras(busca, tipoManobraSel);
  }, [abaAtiva, busca, tipoManobraSel]);

  const regrasFiltradas = useMemo(() => {
    if (abaAtiva !== 'regras') return [];
    return filtrarRegras(busca, tipoRegraSel);
  }, [abaAtiva, busca, tipoRegraSel]);

  const handleCliqueAdicionar = (
    tipo: 'talento' | 'magia' | 'raca' | 'classe' | 'equipamento' | 'manobra',
    item: TalentoData | MagiaData | RacaData | ClasseData | EquipamentoData | PosturaData | GolpeMarcialData
  ) => {
    if (fichaAtual) {
      if (tipo === 'talento') {
        if (onAdicionarTalentoAFicha) {
          onAdicionarTalentoAFicha(item as TalentoData);
          return;
        } else if (onAtualizarFichaAtual) {
          const novo = converterTalentoParaItem(item as TalentoData);
          onAtualizarFichaAtual({ ...fichaAtual, talentos: [...fichaAtual.talentos, novo] });
          return;
        }
      } else if (tipo === 'magia') {
        if (onAdicionarMagiaAFicha) {
          onAdicionarMagiaAFicha(item as MagiaData);
          return;
        } else if (onAtualizarFichaAtual) {
          const nova = converterMagiaParaItem(item as MagiaData);
          onAtualizarFichaAtual({ ...fichaAtual, magias: [...fichaAtual.magias, nova] });
          return;
        }
      } else if (tipo === 'raca') {
        if (onAplicarRacaAFicha) {
          onAplicarRacaAFicha(item as RacaData);
          return;
        } else if (onAtualizarFichaAtual) {
          const r = item as RacaData;
          const novosTracos: HabilidadeOuTalento[] = (r.tracosRaciais || []).map((t) => ({
            id: gerarId(),
            nome: `${t.nome} (${r.nome})`,
            descricao: t.descricao,
          }));
          onAtualizarFichaAtual({
            ...fichaAtual,
            raca: r.nome,
            tamanho: r.tamanho,
            deslocamento: `${r.deslocamento}m`,
            habilidadesRaca: [...fichaAtual.habilidadesRaca, ...novosTracos],
          });
          return;
        }
      } else if (tipo === 'classe') {
        if (onAplicarClasseAFicha) {
          onAplicarClasseAFicha(item as ClasseData);
          return;
        } else if (onAtualizarFichaAtual) {
          onAtualizarFichaAtual(aplicarClasseNaFicha(fichaAtual, item as ClasseData));
          return;
        }
      } else if (tipo === 'equipamento') {
        if (onAdicionarEquipamentoAFicha) {
          onAdicionarEquipamentoAFicha(item as EquipamentoData);
          return;
        } else if (onAtualizarFichaAtual) {
          const eq = item as EquipamentoData;
          if (eq.tipo === 'Arma') {
            const novaArma = converterArmaParaItem(eq);
            onAtualizarFichaAtual({ ...fichaAtual, armas: [...fichaAtual.armas, novaArma] });
          } else if (eq.tipo === 'Armadura' || eq.tipo === 'Escudo') {
            const novaArmadura = converterArmaduraParaItem(eq);
            onAtualizarFichaAtual({ ...fichaAtual, armaduras: [...fichaAtual.armaduras, novaArmadura] });
          } else {
            const novoItem = converterItemGeralParaItem(eq);
            onAtualizarFichaAtual({ ...fichaAtual, itensGerais: [...fichaAtual.itensGerais, novoItem] });
          }
          return;
        }
      } else if (tipo === 'manobra') {
        if (onAdicionarManobraAFicha) {
          onAdicionarManobraAFicha(item as PosturaData | GolpeMarcialData);
          return;
        } else if (onAtualizarFichaAtual) {
          const nova = converterManobraParaItem(item as PosturaData | GolpeMarcialData);
          const manobrasAtuais = Array.isArray(fichaAtual.manobras) ? fichaAtual.manobras : [];
          onAtualizarFichaAtual({ ...fichaAtual, manobras: [...manobrasAtuais, nova] });
          return;
        }
      }
      if (onAdicionarItemParaFichaEspecifica) {
        onAdicionarItemParaFichaEspecifica(fichaAtual.id, tipo, item);
      }
    } else if (todasFichas.length === 1 && onAdicionarItemParaFichaEspecifica) {
      onAdicionarItemParaFichaEspecifica(todasFichas[0].id, tipo, item);
    } else if (todasFichas.length > 1) {
      setItemParaAdicionar({ tipo, dado: item } as ItemCompendio);
    }
  };

  const confirmarAdicaoParaFicha = (fichaId: string) => {
    if (itemParaAdicionar && onAdicionarItemParaFichaEspecifica) {
      onAdicionarItemParaFichaEspecifica(
        fichaId,
        itemParaAdicionar.tipo,
        itemParaAdicionar.dado
      );
    }
    setItemParaAdicionar(null);
  };

  // Checa se o item já está na ficha atual
  const estaNaListaFicha = (
    tipo: 'talento' | 'magia' | 'raca' | 'classe' | 'equipamento' | 'manobra',
    nome: string
  ): boolean => {
    if (!fichaAtual) return false;
    const nomeNorm = nome.trim().toLowerCase();
    const limpo = (s: string) => s.replace(/\s*\[.*?\]/g, '').trim().toLowerCase();
    const nomeLimpo = limpo(nome);

    if (tipo === 'talento') {
      return (
        fichaAtual.talentos.some((t) => {
          const tLimpo = limpo(t.nome);
          return tLimpo === nomeLimpo || t.nome.trim().toLowerCase() === nomeNorm;
        }) ||
        (fichaAtual.habilidadesRaca || []).some((h) => {
          const hLimpo = limpo(h.nome);
          return hLimpo.includes(nomeLimpo) || nomeLimpo.includes(hLimpo);
        }) ||
        (fichaAtual.habilidadesClasse || []).some((h) => {
          const hLimpo = limpo(h.nome);
          return hLimpo.includes(nomeLimpo) || nomeLimpo.includes(hLimpo);
        })
      );
    } else if (tipo === 'magia') {
      return fichaAtual.magias.some(
        (m) => m.nome.trim().toLowerCase() === nomeNorm || limpo(m.nome) === nomeLimpo
      );
    } else if (tipo === 'raca') {
      return fichaAtual.raca?.trim().toLowerCase() === nomeNorm;
    } else if (tipo === 'classe') {
      const classesAtuais = obterClassesFicha(fichaAtual);
      return (
        classesAtuais.some(
          (c) => c.nome.trim().toLowerCase() === nomeNorm || c.nome.toLowerCase().includes(nomeNorm)
        ) || (fichaAtual.classe?.trim().toLowerCase().includes(nomeNorm) || false)
      );
    } else if (tipo === 'manobra') {
      const manobrasAtuais = Array.isArray(fichaAtual.manobras) ? fichaAtual.manobras : [];
      return (
        manobrasAtuais.some((m) => m.nome.trim().toLowerCase() === nomeNorm || limpo(m.nome) === nomeLimpo) ||
        fichaAtual.habilidadesClasse.some((h) => h.nome.trim().toLowerCase().includes(nomeNorm)) ||
        fichaAtual.talentos.some((t) => t.nome.trim().toLowerCase().includes(nomeNorm))
      );
    } else {
      return (
        fichaAtual.armas.some((a) => a.nome.trim().toLowerCase() === nomeNorm) ||
        fichaAtual.armaduras.some((a) => a.nome.trim().toLowerCase() === nomeNorm) ||
        fichaAtual.itensGerais.some((i) => i.nome.trim().toLowerCase() === nomeNorm)
      );
    }
  };

  const obterPlaceholderBusca = () => {
    switch (abaAtiva) {
      case 'talentos':
        return 'Buscar talento por nome, pré-requisito ou efeito...';
      case 'magias':
        return 'Buscar magia por nome, escola ou efeito...';
      case 'racas':
        return 'Buscar raça por nome, tamanho ou traço racial...';
      case 'classes':
        return 'Buscar classe por nome, pré-requisito ou habilidade...';
      case 'equipamentos':
        return 'Buscar equipamento por nome, dano, tipo ou descrição...';
      case 'manobras':
        return 'Buscar manobra, postura ou golpe marcial...';
      case 'regras':
        return 'Buscar regra, condição, ponto de ação ou poder de arma...';
    }
  };

  const obterContadorTexto = () => {
    switch (abaAtiva) {
      case 'talentos':
        return `${talentosFiltrados.length} talentos encontrados`;
      case 'magias':
        return `${magiasFiltradas.length} magias encontradas`;
      case 'racas':
        return `${racasFiltradas.length} raças encontradas`;
      case 'classes':
        return `${classesFiltradas.length} classes encontradas`;
      case 'equipamentos':
        return `${equipamentosFiltrados.length} equipamentos encontrados`;
      case 'manobras':
        return `${manobrasFiltradas.length} manobras encontradas`;
      case 'regras':
        return `${regrasFiltradas.length} regras encontradas`;
    }
  };

  const conteudoCompendio = (
    <SafeAreaView style={styles.container}>
      <View style={styles.innerContainer}>
          {/* Top Header */}
          <View style={styles.header}>
            <View style={styles.headerTitleCol}>
              <Text style={styles.headerTitle}>Compêndio de Regras</Text>
              <Text style={styles.headerSubtitle}>
                {fichaAtual
                  ? `Adicionando à ficha: ${fichaAtual.nomePersonagem || 'Personagem'}`
                  : 'Consulta de Talentos, Magias, Raças, Classes e Equipamentos'}
              </Text>
            </View>
            <View style={styles.headerActionsRow}>
              {!standalone && Platform.OS === 'web' && (
                <TouchableOpacity
                  style={styles.btnDestacar}
                  onPress={abrirCompendioEmJanelaSeparada}
                  activeOpacity={0.8}
                  accessibilityLabel="Abrir em Nova Janela Separada"
                >
                  <Text style={styles.btnDestacarText}>🗗 Nova Janela</Text>
                </TouchableOpacity>
              )}
              <TouchableOpacity style={styles.btnFechar} onPress={onFechar}>
                <Text style={styles.btnFecharText}>{standalone ? '✕ Fechar Janela' : '✕ Fechar'}</Text>
              </TouchableOpacity>
            </View>
          </View>

          {/* Abas Superiores (Scroll horizontal para comportar todas) */}
          <View style={styles.tabsWrapper}>
            <ScrollView
              horizontal
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={styles.tabsRow}
            >
              <TouchableOpacity
                style={[styles.tabBtn, abaAtiva === 'talentos' && styles.tabBtnAtivo]}
                onPress={() => setAbaAtiva('talentos')}
              >
                <Text
                  style={[
                    styles.tabBtnText,
                    abaAtiva === 'talentos' && styles.tabBtnTextAtivo,
                  ]}
                >
                  Talentos ({talentos.length})
                </Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={[styles.tabBtn, abaAtiva === 'magias' && styles.tabBtnAtivo]}
                onPress={() => setAbaAtiva('magias')}
              >
                <Text
                  style={[
                    styles.tabBtnText,
                    abaAtiva === 'magias' && styles.tabBtnTextAtivo,
                  ]}
                >
                  Magias ({magias.length})
                </Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={[styles.tabBtn, abaAtiva === 'racas' && styles.tabBtnAtivo]}
                onPress={() => setAbaAtiva('racas')}
              >
                <Text
                  style={[
                    styles.tabBtnText,
                    abaAtiva === 'racas' && styles.tabBtnTextAtivo,
                  ]}
                >
                  Raças ({racas.length})
                </Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={[styles.tabBtn, abaAtiva === 'classes' && styles.tabBtnAtivo]}
                onPress={() => setAbaAtiva('classes')}
              >
                <Text
                  style={[
                    styles.tabBtnText,
                    abaAtiva === 'classes' && styles.tabBtnTextAtivo,
                  ]}
                >
                  Classes ({classes.length})
                </Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={[
                  styles.tabBtn,
                  abaAtiva === 'equipamentos' && styles.tabBtnAtivo,
                ]}
                onPress={() => setAbaAtiva('equipamentos')}
              >
                <Text
                  style={[
                    styles.tabBtnText,
                    abaAtiva === 'equipamentos' && styles.tabBtnTextAtivo,
                  ]}
                >
                  Equipamentos ({equipamentos.length})
                </Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={[
                  styles.tabBtn,
                  abaAtiva === 'manobras' && styles.tabBtnAtivo,
                ]}
                onPress={() => setAbaAtiva('manobras')}
              >
                <Text
                  style={[
                    styles.tabBtnText,
                    abaAtiva === 'manobras' && styles.tabBtnTextAtivo,
                  ]}
                >
                  Manobras ({posturas.length + golpesMarciais.length})
                </Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={[
                  styles.tabBtn,
                  abaAtiva === 'regras' && styles.tabBtnAtivo,
                ]}
                onPress={() => setAbaAtiva('regras')}
              >
                <Text
                  style={[
                    styles.tabBtnText,
                    abaAtiva === 'regras' && styles.tabBtnTextAtivo,
                  ]}
                >
                  Regras ({todasRegras.length})
                </Text>
              </TouchableOpacity>
            </ScrollView>
          </View>

          {/* Barra de Busca */}
          <View style={styles.buscaWrap}>
            <TextInput
              style={styles.buscaInput}
              placeholder={obterPlaceholderBusca()}
              placeholderTextColor={COLORS.textSecondary}
              value={busca}
              onChangeText={setBusca}
              autoCorrect={false}
            />
            {busca.length > 0 && (
              <TouchableOpacity
                style={styles.btnLimparBusca}
                onPress={() => setBusca('')}
              >
                <Text style={styles.btnLimparBuscaText}>✕</Text>
              </TouchableOpacity>
            )}
          </View>

          {/* Barra de Filtros Contextuais */}
          {abaAtiva === 'talentos' && (
            <View style={styles.filtrosContainer}>
              <ScrollView
                horizontal
                showsHorizontalScrollIndicator={false}
                contentContainerStyle={styles.chipsScroll}
              >
                {CATEGORIAS_TALENTO.map((cat) => (
                  <TouchableOpacity
                    key={cat}
                    style={[styles.chip, categoriaSel === cat && styles.chipAtivo]}
                    onPress={() => setCategoriaSel(cat)}
                  >
                    <Text
                      style={[
                        styles.chipText,
                        categoriaSel === cat && styles.chipTextAtivo,
                      ]}
                    >
                      {cat}
                    </Text>
                  </TouchableOpacity>
                ))}
              </ScrollView>

              {/* Filtro inteligente de Pré-requisitos cumpridos pelo personagem atual */}
              {fichaAtual && (
                <View style={styles.filtroPersonagemRow}>
                  <TouchableOpacity
                    style={[
                      styles.btnFiltroPreReq,
                      apenasRequisitosCumpridos && styles.btnFiltroPreReqAtivo,
                    ]}
                    onPress={() => setApenasRequisitosCumpridos(!apenasRequisitosCumpridos)}
                    activeOpacity={0.8}
                  >
                    <Text
                      style={[
                        styles.btnFiltroPreReqText,
                        apenasRequisitosCumpridos && styles.btnFiltroPreReqTextAtivo,
                      ]}
                    >
                      {apenasRequisitosCumpridos
                        ? `🎯 Mostrando apenas talentos disponíveis para ${fichaAtual.nomePersonagem?.trim() || 'meu personagem'}`
                        : `🎯 Filtrar apenas talentos disponíveis para ${fichaAtual.nomePersonagem?.trim() || 'meu personagem'}`}
                    </Text>
                  </TouchableOpacity>
                </View>
              )}
            </View>
          )}

          {abaAtiva === 'magias' && (
            <View style={styles.filtrosContainer}>
              <View style={styles.magiaFiltrosCol}>
                <ScrollView
                  horizontal
                  showsHorizontalScrollIndicator={false}
                  contentContainerStyle={styles.chipsScroll}
                >
                  <TouchableOpacity
                    style={[styles.chip, nivelSel === null && styles.chipAtivo]}
                    onPress={() => setNivelSel(null)}
                  >
                    <Text
                      style={[
                        styles.chipText,
                        nivelSel === null && styles.chipTextAtivo,
                      ]}
                    >
                      Todos os Níveis
                    </Text>
                  </TouchableOpacity>
                  {[0, 1, 2, 3, 4, 5, 6, 7, 8, 9].map((lvl) => (
                    <TouchableOpacity
                      key={lvl}
                      style={[styles.chip, nivelSel === lvl && styles.chipAtivo]}
                      onPress={() => setNivelSel(lvl)}
                    >
                      <Text
                        style={[
                          styles.chipText,
                          nivelSel === lvl && styles.chipTextAtivo,
                        ]}
                      >
                        {lvl === 0 ? 'Nível 0' : `${lvl}º Nível`}
                      </Text>
                    </TouchableOpacity>
                  ))}
                </ScrollView>

                <ScrollView
                  horizontal
                  showsHorizontalScrollIndicator={false}
                  contentContainerStyle={[styles.chipsScroll, { marginTop: 6 }]}
                >
                  {(['Todas', 'Arcana', 'Divina'] as const).map((tipo) => (
                    <TouchableOpacity
                      key={tipo}
                      style={[
                        styles.chip,
                        tipoMagiaSel === tipo && styles.chipAtivo,
                      ]}
                      onPress={() => setTipoMagiaSel(tipo)}
                    >
                      <Text
                        style={[
                          styles.chipText,
                          tipoMagiaSel === tipo && styles.chipTextAtivo,
                        ]}
                      >
                        {tipo === 'Todas' ? 'Arcana / Divina' : tipo}
                      </Text>
                    </TouchableOpacity>
                  ))}

                  <View style={styles.divisorVertical} />

                  {ESCOLAS_MAGIA.map((esc) => (
                    <TouchableOpacity
                      key={esc}
                      style={[styles.chip, escolaSel === esc && styles.chipAtivo]}
                      onPress={() => setEscolaSel(esc)}
                    >
                      <Text
                        style={[
                          styles.chipText,
                          escolaSel === esc && styles.chipTextAtivo,
                        ]}
                      >
                        {esc}
                      </Text>
                    </TouchableOpacity>
                  ))}
                </ScrollView>
              </View>
            </View>
          )}

          {abaAtiva === 'classes' && (
            <View style={styles.filtrosContainer}>
              <ScrollView
                horizontal
                showsHorizontalScrollIndicator={false}
                contentContainerStyle={styles.chipsScroll}
              >
                {(
                  [
                    { valor: 'Todas', rotulo: 'Todas as Classes' },
                    { valor: 'Basica', rotulo: 'Classes Básicas' },
                    { valor: 'Prestigio', rotulo: 'Classes de Prestígio' },
                  ] as const
                ).map((t) => (
                  <TouchableOpacity
                    key={t.valor}
                    style={[
                      styles.chip,
                      tipoClasseSel === t.valor && styles.chipAtivo,
                    ]}
                    onPress={() => setTipoClasseSel(t.valor)}
                  >
                    <Text
                      style={[
                        styles.chipText,
                        tipoClasseSel === t.valor && styles.chipTextAtivo,
                      ]}
                    >
                      {t.rotulo}
                    </Text>
                  </TouchableOpacity>
                ))}
              </ScrollView>
            </View>
          )}

          {abaAtiva === 'equipamentos' && (
            <View style={styles.filtrosContainer}>
              <ScrollView
                horizontal
                showsHorizontalScrollIndicator={false}
                contentContainerStyle={styles.chipsScroll}
              >
                {TIPOS_EQUIPAMENTO.map((tipo) => (
                  <TouchableOpacity
                    key={tipo}
                    style={[
                      styles.chip,
                      tipoEquipSel === tipo && styles.chipAtivo,
                    ]}
                    onPress={() => setTipoEquipSel(tipo)}
                  >
                    <Text
                      style={[
                        styles.chipText,
                        tipoEquipSel === tipo && styles.chipTextAtivo,
                      ]}
                    >
                      {tipo}
                    </Text>
                  </TouchableOpacity>
                ))}
              </ScrollView>
            </View>
          )}

          {abaAtiva === 'manobras' && (
            <View style={styles.filtrosContainer}>
              <ScrollView
                horizontal
                showsHorizontalScrollIndicator={false}
                contentContainerStyle={styles.chipsScroll}
              >
                {(
                  [
                    { valor: 'Todas', rotulo: 'Todas as Manobras' },
                    { valor: 'Postura', rotulo: 'Posturas' },
                    { valor: 'Golpe Marcial', rotulo: 'Golpes Marciais' },
                  ] as const
                ).map((t) => (
                  <TouchableOpacity
                    key={t.valor}
                    style={[
                      styles.chip,
                      tipoManobraSel === t.valor && styles.chipAtivo,
                    ]}
                    onPress={() => setTipoManobraSel(t.valor)}
                  >
                    <Text
                      style={[
                        styles.chipText,
                        tipoManobraSel === t.valor && styles.chipTextAtivo,
                      ]}
                    >
                      {t.rotulo}
                    </Text>
                  </TouchableOpacity>
                ))}
              </ScrollView>
            </View>
          )}

          {abaAtiva === 'regras' && (
            <View style={styles.filtrosContainer}>
              <ScrollView
                horizontal
                showsHorizontalScrollIndicator={false}
                contentContainerStyle={styles.chipsScroll}
              >
                {TIPOS_REGRA.map((tipo) => (
                  <TouchableOpacity
                    key={tipo}
                    style={[
                      styles.chip,
                      tipoRegraSel === tipo && styles.chipAtivo,
                    ]}
                    onPress={() => setTipoRegraSel(tipo)}
                  >
                    <Text
                      style={[
                        styles.chipText,
                        tipoRegraSel === tipo && styles.chipTextAtivo,
                      ]}
                    >
                      {tipo}
                    </Text>
                  </TouchableOpacity>
                ))}
              </ScrollView>
            </View>
          )}

          {/* Contador de resultados */}
          <View style={styles.contadorRow}>
            <Text style={styles.contadorText}>{obterContadorTexto()}</Text>
          </View>

          {/* LISTA DE RESULTADOS POR ABA */}

          {/* 1. ABA DE TALENTOS */}
          {abaAtiva === 'talentos' && (
            <FlatList
              data={talentosFiltrados}
              keyExtractor={(item) => item.id}
              contentContainerStyle={styles.listContent}
              initialNumToRender={15}
              maxToRenderPerBatch={20}
              windowSize={10}
              ListEmptyComponent={
                <View style={styles.emptyWrap}>
                  <Text style={styles.emptyText}>
                    Nenhum talento encontrado com os filtros selecionados.
                  </Text>
                </View>
              }
              renderItem={({ item }) => {
                const expandido = !!expandidos[item.id];
                const jaPossui = estaNaListaFicha('talento', item.nome);
                const talentosCitados = identificarTalentosCitadosEmPreRequisitos(item.preRequisitos, item.id);
                const reqStatus = fichaAtual ? verificarPreRequisitosCumpridos(fichaAtual, item) : null;

                return (
                  <View style={styles.cardItem}>
                    <TouchableOpacity
                      style={styles.cardItemHeader}
                      onPress={() => alternarExpandido(item.id)}
                      activeOpacity={0.7}
                    >
                      <View style={styles.cardItemTitleCol}>
                        <View style={styles.badgeRow}>
                          <View style={styles.badgeCategoria}>
                            <Text style={styles.badgeCategoriaText}>
                              {item.categoria}
                            </Text>
                          </View>
                          {jaPossui && (
                            <View style={styles.badgePossui}>
                              <Text style={styles.badgePossuiText}>✓ Na Ficha</Text>
                            </View>
                          )}
                          {reqStatus && !jaPossui && (
                            <View
                              style={[
                                styles.badgeReqStatus,
                                reqStatus.cumpre
                                  ? styles.badgeReqCumpre
                                  : styles.badgeReqPendente,
                              ]}
                            >
                              <Text
                                style={[
                                  styles.badgeReqStatusText,
                                  reqStatus.cumpre
                                    ? styles.badgeReqCumpreText
                                    : styles.badgeReqPendenteText,
                                ]}
                              >
                                {reqStatus.cumpre
                                  ? '✓ Requisitos Atendidos'
                                  : '⚠️ Requisitos Pendentes'}
                              </Text>
                            </View>
                          )}
                        </View>
                        <Text style={styles.cardItemNome}>{item.nome}</Text>
                        {item.preRequisitos &&
                          item.preRequisitos !== 'Nenhum.' && (
                            <Text
                              style={styles.cardItemPreReq}
                              numberOfLines={expandido ? undefined : 1}
                            >
                              <Text style={styles.negrito}>Pré-requisitos: </Text>
                              {item.preRequisitos}
                            </Text>
                          )}

                        {/* Chips clicáveis para ver os talentos que são pré-requisito */}
                        {talentosCitados.length > 0 && (
                          <View style={styles.chipsPreReqRow}>
                            <Text style={styles.chipsPreReqLabel}>Ver talento exigido:</Text>
                            {talentosCitados.map((tCitado) => (
                              <TouchableOpacity
                                key={tCitado.id}
                                style={styles.chipPreReqBtn}
                                onPress={() => setTalentoDetalheModal(tCitado)}
                                activeOpacity={0.7}
                              >
                                <Text style={styles.chipPreReqBtnText}>🔗 {tCitado.nome}</Text>
                              </TouchableOpacity>
                            ))}
                          </View>
                        )}
                      </View>

                      <TouchableOpacity
                        style={[
                          styles.btnAdicionar,
                          jaPossui && styles.btnAdicionarSecundario,
                        ]}
                        onPress={() => handleCliqueAdicionar('talento', item)}
                      >
                        <Text
                          style={[
                            styles.btnAdicionarText,
                            jaPossui && styles.btnAdicionarSecundarioText,
                          ]}
                        >
                          {jaPossui ? '✓ Adicionado' : (fichaAtual ? '+ Adicionar' : '+ Personagem')}
                        </Text>
                      </TouchableOpacity>
                    </TouchableOpacity>

                    {!expandido && (
                      <TouchableOpacity
                        onPress={() => alternarExpandido(item.id)}
                        style={styles.previaContainer}
                      >
                        <Text
                          style={styles.cardItemBeneficioPrevia}
                          numberOfLines={2}
                        >
                          {item.beneficio}
                        </Text>
                        <Text style={styles.toqueMaisText}>
                          Toque para ver detalhes ▼
                        </Text>
                      </TouchableOpacity>
                    )}

                    {expandido && (
                      <View style={styles.cardItemExpandido}>
                        {reqStatus && !reqStatus.cumpre && reqStatus.pendencias.length > 0 && (
                          <View style={styles.pendenciasBox}>
                            <Text style={styles.pendenciasTitulo}>⚠️ Pendências para seu personagem:</Text>
                            {reqStatus.pendencias.map((pend, pIdx) => (
                              <Text key={pIdx} style={styles.pendenciaItem}>• {pend}</Text>
                            ))}
                          </View>
                        )}

                        <View style={styles.beneficioBox}>
                          <Text style={styles.beneficioLabel}>Benefício / Efeito:</Text>
                          <Text style={styles.beneficioTexto}>{item.beneficio || item.descricao}</Text>
                        </View>

                        <TouchableOpacity
                          style={styles.btnRecolher}
                          onPress={() => alternarExpandido(item.id)}
                        >
                          <Text style={styles.btnRecolherText}>Recolher ▲</Text>
                        </TouchableOpacity>
                      </View>
                    )}
                  </View>
                );
              }}
            />
          )}

          {/* 2. ABA DE MAGIAS */}
          {abaAtiva === 'magias' && (
            <FlatList
              data={magiasFiltradas}
              keyExtractor={(item) => item.id}
              contentContainerStyle={styles.listContent}
              initialNumToRender={15}
              maxToRenderPerBatch={20}
              windowSize={10}
              ListEmptyComponent={
                <View style={styles.emptyWrap}>
                  <Text style={styles.emptyText}>
                    Nenhuma magia encontrada com os filtros selecionados.
                  </Text>
                </View>
              }
              renderItem={({ item }) => {
                const expandido = !!expandidos[item.id];
                const jaPossui = estaNaListaFicha('magia', item.nome);
                return (
                  <View style={styles.cardItem}>
                    <TouchableOpacity
                      style={styles.cardItemHeader}
                      onPress={() => alternarExpandido(item.id)}
                      activeOpacity={0.7}
                    >
                      <View style={styles.cardItemTitleCol}>
                        <View style={styles.badgeRow}>
                          <View style={styles.badgeNivel}>
                            <Text style={styles.badgeNivelText}>
                              {item.nivel === 0
                                ? 'Nível 0'
                                : `${item.nivel}º Nível`}
                            </Text>
                          </View>
                          <View style={styles.badgeEscola}>
                            <Text style={styles.badgeEscolaText}>
                              {item.escola}
                            </Text>
                          </View>
                          <View style={styles.badgeTipo}>
                            <Text style={styles.badgeTipoText}>{item.tipo}</Text>
                          </View>
                          {jaPossui && (
                            <View style={styles.badgePossui}>
                              <Text style={styles.badgePossuiText}>
                                ✓ No Grimório
                              </Text>
                            </View>
                          )}
                        </View>
                        <Text style={styles.cardItemNome}>{item.nome}</Text>
                        <Text
                          style={styles.cardItemResumo}
                          numberOfLines={expandido ? undefined : 1}
                        >
                          {item.tempoExecucao} • {item.alcance} • {item.duracao}
                        </Text>
                      </View>

                      <TouchableOpacity
                        style={[
                          styles.btnAdicionar,
                          jaPossui && styles.btnAdicionarSecundario,
                        ]}
                        onPress={() => handleCliqueAdicionar('magia', item)}
                      >
                        <Text
                          style={[
                            styles.btnAdicionarText,
                            jaPossui && styles.btnAdicionarSecundarioText,
                          ]}
                        >
                          {jaPossui ? '✓ Adicionado' : (fichaAtual ? '+ Adicionar' : '+ Personagem')}
                        </Text>
                      </TouchableOpacity>
                    </TouchableOpacity>

                    {!expandido && (
                      <TouchableOpacity
                        onPress={() => alternarExpandido(item.id)}
                        style={styles.previaContainer}
                      >
                        <Text
                          style={styles.cardItemBeneficioPrevia}
                          numberOfLines={2}
                        >
                          {item.descricao}
                        </Text>
                        <Text style={styles.toqueMaisText}>
                          Toque para ver detalhes ▼
                        </Text>
                      </TouchableOpacity>
                    )}

                    {expandido && (
                      <View style={styles.cardItemExpandido}>
                        <View style={styles.magiaGridParametros}>
                          <View style={styles.magiaParamItem}>
                            <Text style={styles.paramLabel}>Tempo de Execução:</Text>
                            <Text style={styles.paramVal}>{item.tempoExecucao}</Text>
                          </View>
                          <View style={styles.magiaParamItem}>
                            <Text style={styles.paramLabel}>Alcance:</Text>
                            <Text style={styles.paramVal}>{item.alcance}</Text>
                          </View>
                          {item.alvoAreaEfeito ? (
                            <View style={styles.magiaParamItem}>
                              <Text style={styles.paramLabel}>
                                Alvo / Área / Efeito:
                              </Text>
                              <Text style={styles.paramVal}>
                                {item.alvoAreaEfeito}
                              </Text>
                            </View>
                          ) : null}
                          <View style={styles.magiaParamItem}>
                            <Text style={styles.paramLabel}>Duração:</Text>
                            <Text style={styles.paramVal}>{item.duracao}</Text>
                          </View>
                          {item.resistencia ? (
                            <View style={styles.magiaParamItem}>
                              <Text style={styles.paramLabel}>
                                Teste de Resistência:
                              </Text>
                              <Text style={styles.paramVal}>{item.resistencia}</Text>
                            </View>
                          ) : null}
                          {item.componenteMaterial ? (
                            <View style={styles.magiaParamItem}>
                              <Text style={styles.paramLabel}>
                                Componente Material:
                              </Text>
                              <Text style={styles.paramVal}>
                                {item.componenteMaterial}
                              </Text>
                            </View>
                          ) : null}
                        </View>

                        <View style={styles.beneficioBox}>
                          <Text style={styles.beneficioLabel}>Efeito Mágico:</Text>
                          <Text style={styles.beneficioTexto}>{item.descricao}</Text>
                        </View>

                        <TouchableOpacity
                          style={styles.btnRecolher}
                          onPress={() => alternarExpandido(item.id)}
                        >
                          <Text style={styles.btnRecolherText}>Recolher ▲</Text>
                        </TouchableOpacity>
                      </View>
                    )}
                  </View>
                );
              }}
            />
          )}

          {/* 3. ABA DE RAÇAS */}
          {abaAtiva === 'racas' && (
            <FlatList
              data={racasFiltradas}
              keyExtractor={(item) => item.id}
              contentContainerStyle={styles.listContent}
              initialNumToRender={12}
              maxToRenderPerBatch={15}
              windowSize={10}
              ListEmptyComponent={
                <View style={styles.emptyWrap}>
                  <Text style={styles.emptyText}>
                    Nenhuma raça encontrada com o termo buscado.
                  </Text>
                </View>
              }
              renderItem={({ item }) => {
                const expandido = !!expandidos[item.id];
                const jaPossui = estaNaListaFicha('raca', item.nome);

                return (
                  <View style={styles.cardItem}>
                    <TouchableOpacity
                      style={styles.cardItemHeader}
                      onPress={() => alternarExpandido(item.id)}
                      activeOpacity={0.7}
                    >
                      <View style={styles.cardItemTitleCol}>
                        <View style={styles.badgeRow}>
                          <View style={styles.badgeRaca}>
                            <Text style={styles.badgeRacaText}>Raça</Text>
                          </View>
                          <View style={styles.badgeLivro}>
                            <Text style={styles.badgeLivroText}>{item.livroFonte}</Text>
                          </View>
                          {jaPossui && (
                            <View style={styles.badgePossui}>
                              <Text style={styles.badgePossuiText}>✓ Raça Atual</Text>
                            </View>
                          )}
                        </View>

                        <Text style={styles.cardItemNome}>{item.nome}</Text>

                        {/* Modificadores de Atributos */}
                        <Text style={styles.cardItemPreReq}>
                          <Text style={styles.negrito}>Atributos: </Text>
                          {item.modificadoresAtributos}
                        </Text>

                        <Text style={styles.cardItemResumo}>
                          Desl: {item.deslocamento} • Tamanho: {item.tamanho}
                          {item.visao ? ` • Visão: ${item.visao}` : ''}
                        </Text>
                      </View>

                      <TouchableOpacity
                        style={[
                          styles.btnAdicionar,
                          jaPossui && styles.btnAdicionarSecundario,
                        ]}
                        onPress={() => handleCliqueAdicionar('raca', item)}
                      >
                        <Text
                          style={[
                            styles.btnAdicionarText,
                            jaPossui && styles.btnAdicionarSecundarioText,
                          ]}
                        >
                          {jaPossui ? '✓ Adicionado' : (fichaAtual ? '+ Aplicar' : '+ Personagem')}
                        </Text>
                      </TouchableOpacity>
                    </TouchableOpacity>

                    {!expandido && (
                      <TouchableOpacity
                        onPress={() => alternarExpandido(item.id)}
                        style={styles.previaContainer}
                      >
                        <Text
                          style={styles.cardItemBeneficioPrevia}
                          numberOfLines={2}
                        >
                          {item.descricao}
                        </Text>
                        <Text style={styles.toqueMaisText}>
                          Ver traços raciais ({item.tracosRaciais.length}) ▼
                        </Text>
                      </TouchableOpacity>
                    )}

                    {expandido && (
                      <View style={styles.cardItemExpandido}>
                        <Text style={styles.cardItemDescricaoFlavor}>
                          "{item.descricao}"
                        </Text>

                        <Text style={styles.secaoTituloInterno}>
                          Traços Raciais:
                        </Text>
                        {item.tracosRaciais.map((traco, idx) => (
                          <View key={idx} style={styles.subItemBox}>
                            <Text style={styles.subItemTitulo}>
                              • {traco.nome}
                            </Text>
                            <Text style={styles.subItemDescricao}>
                              {traco.descricao}
                            </Text>
                          </View>
                        ))}

                        <TouchableOpacity
                          style={styles.btnRecolher}
                          onPress={() => alternarExpandido(item.id)}
                        >
                          <Text style={styles.btnRecolherText}>Recolher ▲</Text>
                        </TouchableOpacity>
                      </View>
                    )}
                  </View>
                );
              }}
            />
          )}

          {/* 4. ABA DE CLASSES */}
          {abaAtiva === 'classes' && (
            <FlatList
              data={classesFiltradas}
              keyExtractor={(item) => item.id}
              contentContainerStyle={styles.listContent}
              initialNumToRender={15}
              maxToRenderPerBatch={20}
              windowSize={10}
              ListEmptyComponent={
                <View style={styles.emptyWrap}>
                  <Text style={styles.emptyText}>
                    Nenhuma classe encontrada com os filtros selecionados.
                  </Text>
                </View>
              }
              renderItem={({ item }) => {
                const expandido = !!expandidos[item.id];
                const jaPossui = estaNaListaFicha('classe', item.nome);
                const ehPrestigio = item.tipo === 'Prestigio';

                return (
                  <View style={styles.cardItem}>
                    <TouchableOpacity
                      style={styles.cardItemHeader}
                      onPress={() => alternarExpandido(item.id)}
                      activeOpacity={0.7}
                    >
                      <View style={styles.cardItemTitleCol}>
                        <View style={styles.badgeRow}>
                          <View
                            style={
                              ehPrestigio
                                ? styles.badgePrestigio
                                : styles.badgeClasseBasica
                            }
                          >
                            <Text
                              style={
                                ehPrestigio
                                  ? styles.badgePrestigioText
                                  : styles.badgeClasseBasicaText
                              }
                            >
                              {ehPrestigio ? 'Prestígio' : 'Classe Básica'}
                            </Text>
                          </View>
                          <View style={styles.badgeLivro}>
                            <Text style={styles.badgeLivroText}>
                              {item.livroFonte}
                            </Text>
                          </View>
                          {jaPossui && (
                            <View style={styles.badgePossui}>
                              <Text style={styles.badgePossuiText}>
                                ✓ Classe Atual
                              </Text>
                            </View>
                          )}
                        </View>

                        <Text style={styles.cardItemNome}>{item.nome}</Text>

                        <Text style={styles.cardItemResumo}>
                          PV Inicial: {item.pvInicial} (+{item.pvPorNivel}/nv) •
                          PM: +{item.pmPorNivel}/nv • BBA: {item.bba}
                        </Text>

                        {item.preRequisitos && (
                          <Text
                            style={styles.cardItemPreReq}
                            numberOfLines={expandido ? undefined : 1}
                          >
                            <Text style={styles.negrito}>Pré-requisitos: </Text>
                            {item.preRequisitos}
                          </Text>
                        )}
                      </View>

                      <TouchableOpacity
                        style={[
                          styles.btnAdicionar,
                          jaPossui && styles.btnAdicionarSecundario,
                        ]}
                        onPress={() => handleCliqueAdicionar('classe', item)}
                      >
                        <Text
                          style={[
                            styles.btnAdicionarText,
                            jaPossui && styles.btnAdicionarSecundarioText,
                          ]}
                        >
                          {jaPossui ? '✓ Adicionado' : (fichaAtual ? '+ Escolher' : '+ Personagem')}
                        </Text>
                      </TouchableOpacity>
                    </TouchableOpacity>

                    {!expandido && (
                      <TouchableOpacity
                        onPress={() => alternarExpandido(item.id)}
                        style={styles.previaContainer}
                      >
                        <Text
                          style={styles.cardItemBeneficioPrevia}
                          numberOfLines={2}
                        >
                          {item.descricao}
                        </Text>
                        <Text style={styles.toqueMaisText}>
                          Ver habilidades ({item.habilidades.length}) ▼
                        </Text>
                      </TouchableOpacity>
                    )}

                    {expandido && (
                      <View style={styles.cardItemExpandido}>
                        <Text style={styles.cardItemDescricaoFlavor}>
                          "{item.descricao}"
                        </Text>

                        {item.proficiencias ? (
                          <View style={styles.proficienciasBox}>
                            <Text style={styles.beneficioLabel}>
                              Proficiências:
                            </Text>
                            <Text style={styles.beneficioTexto}>
                              {item.proficiencias}
                            </Text>
                          </View>
                        ) : null}

                        <Text style={styles.secaoTituloInterno}>
                          Habilidades de Classe:
                        </Text>
                        {item.habilidades.map((hab, idx) => (
                          <View key={idx} style={styles.subItemBox}>
                            <Text style={styles.subItemTitulo}>
                              • [Nível {hab.nivel}] {hab.nome}
                            </Text>
                            <Text style={styles.subItemDescricao}>
                              {hab.descricao}
                            </Text>
                          </View>
                        ))}

                        <TouchableOpacity
                          style={styles.btnRecolher}
                          onPress={() => alternarExpandido(item.id)}
                        >
                          <Text style={styles.btnRecolherText}>Recolher ▲</Text>
                        </TouchableOpacity>
                      </View>
                    )}
                  </View>
                );
              }}
            />
          )}

          {/* 5. ABA DE EQUIPAMENTOS */}
          {abaAtiva === 'equipamentos' && (
            <FlatList
              data={equipamentosFiltrados}
              keyExtractor={(item) => item.id}
              contentContainerStyle={styles.listContent}
              initialNumToRender={15}
              maxToRenderPerBatch={20}
              windowSize={10}
              ListEmptyComponent={
                <View style={styles.emptyWrap}>
                  <Text style={styles.emptyText}>
                    Nenhum equipamento encontrado com os filtros selecionados.
                  </Text>
                </View>
              }
              renderItem={({ item }) => {
                const expandido = !!expandidos[item.id];
                const jaPossui = estaNaListaFicha('equipamento', item.nome);

                return (
                  <View style={styles.cardItem}>
                    <TouchableOpacity
                      style={styles.cardItemHeader}
                      onPress={() => alternarExpandido(item.id)}
                      activeOpacity={0.7}
                    >
                      <View style={styles.cardItemTitleCol}>
                        <View style={styles.badgeRow}>
                          <View style={styles.badgeEquipTipo}>
                            <Text style={styles.badgeEquipTipoText}>
                              {item.tipo}
                            </Text>
                          </View>
                          <View style={styles.badgeCategoria}>
                            <Text style={styles.badgeCategoriaText}>
                              {item.categoria}
                            </Text>
                          </View>
                          <View style={styles.badgeLivro}>
                            <Text style={styles.badgeLivroText}>
                              {item.livroFonte}
                            </Text>
                          </View>
                          {jaPossui && (
                            <View style={styles.badgePossui}>
                              <Text style={styles.badgePossuiText}>✓ No Inventário</Text>
                            </View>
                          )}
                        </View>

                        <Text style={styles.cardItemNome}>{item.nome}</Text>

                        {/* Estatísticas resumidas de acordo com o tipo */}
                        {item.tipo === 'Arma' && (
                          <Text style={styles.cardItemResumo}>
                            Dano: <Text style={styles.negrito}>{item.dano}</Text>{' '}
                            ({item.tipoDano}) • Crítico:{' '}
                            <Text style={styles.negrito}>{item.critico}</Text>
                            {item.alcance && item.alcance !== '—'
                              ? ` • Alcance: ${item.alcance}`
                              : ' • Corpo a corpo'}
                          </Text>
                        )}

                        {(item.tipo === 'Armadura' || item.tipo === 'Escudo') && (
                          <Text style={styles.cardItemResumo}>
                            CA: <Text style={styles.negrito}>+{item.bonusCa}</Text>
                            {item.destrezaMaxima !== undefined && item.destrezaMaxima !== null
                              ? ` • Des Máx: +${item.destrezaMaxima}`
                              : ''}
                            {item.penalidadeArmadura
                              ? ` • Penalidade: ${item.penalidadeArmadura}`
                              : ' • Sem penalidade'}
                          </Text>
                        )}

                        {item.tipo === 'Item Geral' && (
                          <Text style={styles.cardItemResumo}>
                            Preço: {item.preco || '—'} • Peso: {item.peso || '—'}
                          </Text>
                        )}
                      </View>

                      <TouchableOpacity
                        style={[
                          styles.btnAdicionar,
                          jaPossui && styles.btnAdicionarSecundario,
                        ]}
                        onPress={() => handleCliqueAdicionar('equipamento', item)}
                      >
                        <Text
                          style={[
                            styles.btnAdicionarText,
                            jaPossui && styles.btnAdicionarSecundarioText,
                          ]}
                        >
                          {jaPossui ? '✓ Adicionado' : (fichaAtual ? '+ Adicionar' : '+ Personagem')}
                        </Text>
                      </TouchableOpacity>
                    </TouchableOpacity>

                    {!expandido && (
                      <TouchableOpacity
                        onPress={() => alternarExpandido(item.id)}
                        style={styles.previaContainer}
                      >
                        <Text
                          style={styles.cardItemBeneficioPrevia}
                          numberOfLines={2}
                        >
                          {item.descricao ||
                            `Preço: ${item.preco} • Peso: ${item.peso}`}
                        </Text>
                        <Text style={styles.toqueMaisText}>
                          Toque para ver detalhes ▼
                        </Text>
                      </TouchableOpacity>
                    )}

                    {expandido && (
                      <View style={styles.cardItemExpandido}>
                        <View style={styles.equipGridParametros}>
                          <View style={styles.magiaParamItem}>
                            <Text style={styles.paramLabel}>Preço:</Text>
                            <Text style={styles.paramVal}>{item.preco || '—'}</Text>
                          </View>
                          <View style={styles.magiaParamItem}>
                            <Text style={styles.paramLabel}>Peso:</Text>
                            <Text style={styles.paramVal}>{item.peso || '—'}</Text>
                          </View>
                          {item.dano ? (
                            <View style={styles.magiaParamItem}>
                              <Text style={styles.paramLabel}>Dano:</Text>
                              <Text style={styles.paramVal}>
                                {item.dano} ({item.tipoDano})
                              </Text>
                            </View>
                          ) : null}
                          {item.critico ? (
                            <View style={styles.magiaParamItem}>
                              <Text style={styles.paramLabel}>Crítico:</Text>
                              <Text style={styles.paramVal}>{item.critico}</Text>
                            </View>
                          ) : null}
                          {item.bonusCa !== undefined ? (
                            <View style={styles.magiaParamItem}>
                              <Text style={styles.paramLabel}>Bônus na CA:</Text>
                              <Text style={styles.paramVal}>+{item.bonusCa}</Text>
                            </View>
                          ) : null}
                          {item.destrezaMaxima !== undefined && item.destrezaMaxima !== null ? (
                            <View style={styles.magiaParamItem}>
                              <Text style={styles.paramLabel}>Destreza Máxima:</Text>
                              <Text style={styles.paramVal}>
                                +{item.destrezaMaxima}
                              </Text>
                            </View>
                          ) : null}
                          {item.penalidadeArmadura !== undefined && item.penalidadeArmadura !== null ? (
                            <View style={styles.magiaParamItem}>
                              <Text style={styles.paramLabel}>Penalidade:</Text>
                              <Text style={styles.paramVal}>
                                {item.penalidadeArmadura}
                              </Text>
                            </View>
                          ) : null}
                        </View>

                        {item.descricao ? (
                          <View style={styles.beneficioBox}>
                            <Text style={styles.beneficioLabel}>Descrição:</Text>
                            <Text style={styles.beneficioTexto}>
                              {item.descricao}
                            </Text>
                          </View>
                        ) : null}

                        <TouchableOpacity
                          style={styles.btnRecolher}
                          onPress={() => alternarExpandido(item.id)}
                        >
                          <Text style={styles.btnRecolherText}>Recolher ▲</Text>
                        </TouchableOpacity>
                      </View>
                    )}
                  </View>
                );
              }}
            />
          )}

          {/* 6. ABA DE MANOBRAS (POSTURAS E GOLPES) */}
          {abaAtiva === 'manobras' && (
            <FlatList
              data={manobrasFiltradas}
              keyExtractor={(item) => item.id}
              contentContainerStyle={styles.listContent}
              initialNumToRender={15}
              maxToRenderPerBatch={20}
              windowSize={10}
              ListEmptyComponent={
                <View style={styles.emptyWrap}>
                  <Text style={styles.emptyText}>
                    Nenhuma postura ou golpe encontrado com os filtros atuais.
                  </Text>
                </View>
              }
              renderItem={({ item }) => {
                const expandido = !!expandidos[item.id];
                const jaPossui = estaNaListaFicha('manobra', item.nome);
                const ehGolpe = item.tipo === 'Golpe Marcial';
                const golpe = ehGolpe ? (item as GolpeMarcialData) : null;

                return (
                  <View style={styles.cardItem}>
                    <TouchableOpacity
                      style={styles.cardItemHeader}
                      onPress={() => alternarExpandido(item.id)}
                      activeOpacity={0.7}
                    >
                      <View style={styles.cardItemTitleCol}>
                        <View style={styles.badgeRow}>
                          <View
                            style={[
                              styles.badgeCategoria,
                              ehGolpe
                                ? { backgroundColor: 'rgba(200, 100, 30, 0.15)' }
                                : { backgroundColor: 'rgba(30, 100, 180, 0.15)' },
                            ]}
                          >
                            <Text
                              style={[
                                styles.badgeCategoriaText,
                                ehGolpe ? { color: '#B25010' } : { color: '#1B609E' },
                              ]}
                            >
                              {item.tipo}
                            </Text>
                          </View>
                          {golpe && golpe.custo ? (
                            <View style={styles.badgeEscola}>
                              <Text style={styles.badgeEscolaText}>
                                Custo: {golpe.custo}
                              </Text>
                            </View>
                          ) : null}
                          {item.livroFonte ? (
                            <View style={styles.badgeTipo}>
                              <Text style={styles.badgeTipoText}>{item.livroFonte}</Text>
                            </View>
                          ) : null}
                          {jaPossui ? (
                            <View style={styles.badgePossui}>
                              <Text style={styles.badgePossuiText}>Já na ficha</Text>
                            </View>
                          ) : null}
                        </View>
                        <Text style={styles.cardItemNome}>{item.nome}</Text>
                      </View>

                      {(fichaAtual || todasFichas.length > 0) && (
                        <TouchableOpacity
                          style={[
                            styles.btnAdicionar,
                            jaPossui && styles.btnAdicionarSecundario,
                          ]}
                          onPress={() => handleCliqueAdicionar('manobra', item)}
                          disabled={jaPossui}
                        >
                          <Text
                            style={[
                              styles.btnAdicionarText,
                              jaPossui && styles.btnAdicionarSecundarioText,
                            ]}
                          >
                            {jaPossui ? '✓ Adicionado' : '+ À Ficha'}
                          </Text>
                        </TouchableOpacity>
                      )}
                    </TouchableOpacity>

                    {/* Prévia quando recolhido */}
                    {!expandido && (
                      <TouchableOpacity
                        style={styles.previaContainer}
                        onPress={() => alternarExpandido(item.id)}
                        activeOpacity={0.7}
                      >
                        <Text
                          style={styles.cardItemBeneficioPrevia}
                          numberOfLines={2}
                        >
                          {item.efeito || item.descricao}
                        </Text>
                        <Text style={styles.toqueMaisText}>Toque para ver mais ▼</Text>
                      </TouchableOpacity>
                    )}

                    {/* Detalhes completos quando expandido */}
                    {expandido && (
                      <View style={styles.cardItemExpandido}>
                        {golpe && golpe.custo ? (
                          <View style={styles.equipGridParametros}>
                            <View style={styles.magiaParamItem}>
                              <Text style={styles.paramLabel}>Custo de Energia:</Text>
                              <Text style={styles.paramVal}>{golpe.custo}</Text>
                            </View>
                          </View>
                        ) : null}

                        {item.efeito ? (
                          <View style={styles.beneficioBox}>
                            <Text style={styles.beneficioLabel}>Efeito Mecânico:</Text>
                            <Text style={styles.beneficioTexto}>{item.efeito}</Text>
                          </View>
                        ) : null}

                        {item.descricao ? (
                          <View style={styles.beneficioBox}>
                            <Text style={styles.beneficioLabel}>Descrição Detalhada:</Text>
                            <Text style={styles.beneficioTexto}>{item.descricao}</Text>
                          </View>
                        ) : null}

                        <TouchableOpacity
                          style={styles.btnRecolher}
                          onPress={() => alternarExpandido(item.id)}
                        >
                          <Text style={styles.btnRecolherText}>Recolher ▲</Text>
                        </TouchableOpacity>
                      </View>
                    )}
                  </View>
                );
              }}
            />
          )}

          {/* 7. ABA DE REGRAS (CONDIÇÕES, PONTOS DE AÇÃO E ARMAS MÁGICAS) */}
          {abaAtiva === 'regras' && (
            <FlatList
              data={regrasFiltradas}
              keyExtractor={(item) => item.id}
              contentContainerStyle={styles.listContent}
              initialNumToRender={15}
              maxToRenderPerBatch={20}
              windowSize={10}
              ListEmptyComponent={
                <View style={styles.emptyWrap}>
                  <Text style={styles.emptyText}>
                    Nenhuma regra encontrada com os filtros selecionados.
                  </Text>
                </View>
              }
              renderItem={({ item }) => {
                const expandido = !!expandidos[item.id];
                const ehCondicao = item.tipo === 'Condição';
                const ehPontoAcao = item.tipo === 'Pontos de Ação';
                const ehArmaMagica = item.tipo === 'Armas Mágicas';

                return (
                  <View style={styles.cardItem}>
                    <TouchableOpacity
                      style={styles.cardItemHeader}
                      onPress={() => alternarExpandido(item.id)}
                      activeOpacity={0.7}
                    >
                      <View style={styles.cardItemTitleCol}>
                        <View style={styles.badgeRow}>
                          <View
                            style={[
                              styles.badgeCategoria,
                              ehCondicao && { backgroundColor: 'rgba(180, 30, 30, 0.15)' },
                              ehPontoAcao && { backgroundColor: 'rgba(25, 118, 210, 0.15)' },
                              ehArmaMagica && { backgroundColor: 'rgba(123, 31, 162, 0.15)' },
                            ]}
                          >
                            <Text
                              style={[
                                styles.badgeCategoriaText,
                                ehCondicao && { color: COLORS.danger },
                                ehPontoAcao && { color: '#1565C0' },
                                ehArmaMagica && { color: '#6A1B9A' },
                              ]}
                            >
                              {item.tipo}
                            </Text>
                          </View>

                          {item.subtipo ? (
                            <View style={styles.badgeTipo}>
                              <Text style={styles.badgeTipoText}>{item.subtipo}</Text>
                            </View>
                          ) : null}

                          {item.bonusEquivalente ? (
                            <View style={styles.badgeEscola}>
                              <Text style={styles.badgeEscolaText}>
                                Bônus {item.bonusEquivalente}
                              </Text>
                            </View>
                          ) : null}

                          {item.preco ? (
                            <View style={styles.badgePossui}>
                              <Text style={styles.badgePossuiText}>{item.preco}</Text>
                            </View>
                          ) : null}

                          {item.livroFonte ? (
                            <View style={styles.badgeTipo}>
                              <Text style={styles.badgeTipoText}>{item.livroFonte}</Text>
                            </View>
                          ) : null}
                        </View>
                        <Text style={styles.cardItemNome}>{item.nome}</Text>
                      </View>
                    </TouchableOpacity>

                    {/* Prévia quando recolhido */}
                    {!expandido && (
                      <TouchableOpacity
                        style={styles.previaContainer}
                        onPress={() => alternarExpandido(item.id)}
                        activeOpacity={0.7}
                      >
                        <Text
                          style={styles.cardItemBeneficioPrevia}
                          numberOfLines={2}
                        >
                          {item.descricao}
                        </Text>
                        <Text style={styles.toqueMaisText}>Toque para ver mais ▼</Text>
                      </TouchableOpacity>
                    )}

                    {/* Detalhes completos quando expandido */}
                    {expandido && (
                      <View style={styles.cardItemExpandido}>
                        <View style={styles.beneficioBox}>
                          <Text style={styles.beneficioLabel}>Descrição:</Text>
                          <Text style={styles.beneficioTexto}>{item.descricao}</Text>
                        </View>

                        {item.detalhes ? (
                          <View style={styles.beneficioBox}>
                            <Text style={styles.beneficioLabel}>Regras e Efeitos Mecânicos:</Text>
                            <Text style={styles.beneficioTexto}>{item.detalhes}</Text>
                          </View>
                        ) : null}

                        <TouchableOpacity
                          style={styles.btnRecolher}
                          onPress={() => alternarExpandido(item.id)}
                        >
                          <Text style={styles.btnRecolherText}>Recolher ▲</Text>
                        </TouchableOpacity>
                      </View>
                    )}
                  </View>
                );
              }}
            />
          )}

          {/* Modal de Escolha de Personagem (quando acionado fora da ficha) */}
          {itemParaAdicionar && (
            <Modal
              transparent
              animationType="fade"
              visible={!!itemParaAdicionar}
              onRequestClose={() => setItemParaAdicionar(null)}
            >
              <View style={styles.modalBackdrop}>
                <View style={styles.dialogCard}>
                  <Text style={styles.dialogTitle}>
                    Adicionar ao Personagem
                  </Text>
                  <Text style={styles.dialogSubtitle}>
                    Selecione o personagem para registrar "{itemParaAdicionar.dado.nome}":
                  </Text>

                  <ScrollView style={styles.dialogScroll}>
                    {todasFichas.map((f) => (
                      <TouchableOpacity
                        key={f.id}
                        style={styles.dialogFichaItem}
                        onPress={() => confirmarAdicaoParaFicha(f.id)}
                      >
                        <Text style={styles.dialogFichaNome}>
                          {f.nomePersonagem || 'Personagem sem Nome'}
                        </Text>
                        <Text style={styles.dialogFichaDetalhes}>
                          Nível {f.nivel} • {f.classe || 'Classe não definida'}
                        </Text>
                      </TouchableOpacity>
                    ))}
                  </ScrollView>

                  <TouchableOpacity
                    style={styles.dialogBtnCancelar}
                    onPress={() => setItemParaAdicionar(null)}
                  >
                    <Text style={styles.dialogBtnCancelarText}>Cancelar</Text>
                  </TouchableOpacity>
                </View>
              </View>
            </Modal>
          )}

          {/* Modal para Visualizar Detalhes do Talento Pré-requisito Clicado */}
          {talentoDetalheModal && (
            <Modal
              transparent
              animationType="fade"
              visible={!!talentoDetalheModal}
              onRequestClose={() => setTalentoDetalheModal(null)}
            >
              <View style={styles.modalBackdrop}>
                <View style={styles.talentoDetalheDialog}>
                  <View style={styles.talentoDetalheHeader}>
                    <View style={styles.talentoDetalheHeaderCol}>
                      <View style={styles.badgeRow}>
                        <View style={styles.badgeCategoria}>
                          <Text style={styles.badgeCategoriaText}>
                            {talentoDetalheModal.categoria}
                          </Text>
                        </View>
                        {estaNaListaFicha('talento', talentoDetalheModal.nome) && (
                          <View style={styles.badgePossui}>
                            <Text style={styles.badgePossuiText}>✓ Na Ficha</Text>
                          </View>
                        )}
                      </View>
                      <Text style={styles.talentoDetalheTitulo}>{talentoDetalheModal.nome}</Text>
                    </View>
                    <TouchableOpacity
                      style={styles.btnFecharDetalhe}
                      onPress={() => setTalentoDetalheModal(null)}
                    >
                      <Text style={styles.btnFecharDetalheText}>✕</Text>
                    </TouchableOpacity>
                  </View>

                  <ScrollView style={styles.talentoDetalheScroll}>
                    {talentoDetalheModal.preRequisitos && talentoDetalheModal.preRequisitos !== 'Nenhum.' && (
                      <View style={styles.talentoDetalheSecao}>
                        <Text style={styles.talentoDetalheSecaoLabel}>Pré-requisitos:</Text>
                        <Text style={styles.talentoDetalhePreReqText}>{talentoDetalheModal.preRequisitos}</Text>
                        {(() => {
                          const outrosCitados = identificarTalentosCitadosEmPreRequisitos(
                            talentoDetalheModal.preRequisitos,
                            talentoDetalheModal.id
                          );
                          if (outrosCitados.length === 0) return null;
                          return (
                            <View style={styles.chipsPreReqRow}>
                              <Text style={styles.chipsPreReqLabel}>Ver talento exigido:</Text>
                              {outrosCitados.map((outro) => (
                                <TouchableOpacity
                                  key={outro.id}
                                  style={styles.chipPreReqBtn}
                                  onPress={() => setTalentoDetalheModal(outro)}
                                  activeOpacity={0.7}
                                >
                                  <Text style={styles.chipPreReqBtnText}>🔗 {outro.nome}</Text>
                                </TouchableOpacity>
                              ))}
                            </View>
                          );
                        })()}
                      </View>
                    )}

                    <View style={styles.talentoDetalheSecao}>
                      <Text style={styles.talentoDetalheSecaoLabel}>Benefício:</Text>
                      <Text style={styles.talentoDetalheBeneficioText}>{talentoDetalheModal.beneficio}</Text>
                    </View>

                    {talentoDetalheModal.descricao ? (
                      <View style={styles.talentoDetalheSecao}>
                        <Text style={styles.cardItemDescricaoFlavor}>"{talentoDetalheModal.descricao}"</Text>
                      </View>
                    ) : null}
                  </ScrollView>

                  <View style={styles.talentoDetalheFooter}>
                    <TouchableOpacity
                      style={styles.dialogBtnCancelar}
                      onPress={() => setTalentoDetalheModal(null)}
                    >
                      <Text style={styles.dialogBtnCancelarText}>Fechar</Text>
                    </TouchableOpacity>

                    <TouchableOpacity
                      style={[
                        styles.btnAdicionar,
                        estaNaListaFicha('talento', talentoDetalheModal.nome) && styles.btnAdicionarSecundario,
                      ]}
                      onPress={() => {
                        handleCliqueAdicionar('talento', talentoDetalheModal);
                        setTalentoDetalheModal(null);
                      }}
                      disabled={estaNaListaFicha('talento', talentoDetalheModal.nome)}
                    >
                      <Text
                        style={[
                          styles.btnAdicionarText,
                          estaNaListaFicha('talento', talentoDetalheModal.nome) &&
                            styles.btnAdicionarSecundarioText,
                        ]}
                      >
                        {estaNaListaFicha('talento', talentoDetalheModal.nome)
                          ? '✓ Adicionado'
                          : fichaAtual
                          ? '+ Adicionar à Ficha'
                          : '+ Personagem'}
                      </Text>
                    </TouchableOpacity>
                  </View>
                </View>
              </View>
            </Modal>
          )}
        </View>
      </SafeAreaView>
  );

  if (standalone) {
    return conteudoCompendio;
  }

  return (
    <Modal
      visible={visivel}
      animationType="slide"
      onRequestClose={onFechar}
      presentationStyle="pageSheet"
    >
      {conteudoCompendio}
    </Modal>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  innerContainer: {
    flex: 1,
    width: '100%',
    maxWidth: 1100,
    alignSelf: 'center',
    backgroundColor: COLORS.background,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: COLORS.surface,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
  },
  headerTitleCol: {
    flex: 1,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: COLORS.primary,
  },
  headerSubtitle: {
    fontSize: 12,
    color: COLORS.textSecondary,
    marginTop: 2,
  },
  headerActionsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  btnDestacar: {
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 6,
    backgroundColor: 'rgba(200, 157, 60, 0.15)',
    borderWidth: 1,
    borderColor: COLORS.gold,
  },
  btnDestacarText: {
    color: COLORS.primaryDark,
    fontWeight: 'bold',
    fontSize: 12,
  },
  btnFechar: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 6,
    backgroundColor: 'rgba(139,30,30,0.1)',
  },
  btnFecharText: {
    color: COLORS.primary,
    fontWeight: 'bold',
    fontSize: 13,
  },
  tabsWrapper: {
    backgroundColor: COLORS.surfaceVariant,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
  },
  tabsRow: {
    flexDirection: 'row',
    padding: 6,
    gap: 8,
    alignItems: 'center',
  },
  tabBtn: {
    paddingHorizontal: 14,
    paddingVertical: 8,
    alignItems: 'center',
    borderRadius: 6,
    cursor: 'pointer' as any,
  },
  tabBtnAtivo: {
    backgroundColor: COLORS.primary,
  },
  tabBtnText: {
    fontSize: 13,
    fontWeight: 'bold',
    color: COLORS.textSecondary,
  },
  tabBtnTextAtivo: {
    color: COLORS.white,
  },
  buscaWrap: {
    paddingHorizontal: 12,
    paddingVertical: 8,
    backgroundColor: COLORS.surface,
    position: 'relative',
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
  },
  buscaInput: {
    backgroundColor: COLORS.surfaceVariant,
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 8,
    fontSize: 14,
    color: COLORS.text,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  btnLimparBusca: {
    position: 'absolute',
    right: 22,
    top: 16,
    padding: 4,
  },
  btnLimparBuscaText: {
    color: COLORS.textSecondary,
    fontWeight: 'bold',
    fontSize: 14,
  },
  filtrosContainer: {
    backgroundColor: COLORS.surface,
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
  },
  chipsScroll: {
    paddingHorizontal: 12,
    gap: 6,
    alignItems: 'center',
  },
  chip: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
    backgroundColor: COLORS.surfaceVariant,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  chipAtivo: {
    backgroundColor: COLORS.primary,
    borderColor: COLORS.primary,
  },
  chipText: {
    fontSize: 12,
    fontWeight: '600',
    color: COLORS.text,
  },
  chipTextAtivo: {
    color: COLORS.white,
  },
  magiaFiltrosCol: {
    gap: 4,
  },
  divisorVertical: {
    width: 1,
    height: 20,
    backgroundColor: COLORS.border,
    marginHorizontal: 4,
  },
  contadorRow: {
    paddingHorizontal: 16,
    paddingVertical: 6,
    backgroundColor: COLORS.background,
  },
  contadorText: {
    fontSize: 12,
    color: COLORS.textSecondary,
    fontStyle: 'italic',
  },
  listContent: {
    padding: 12,
    paddingBottom: 36,
  },
  cardItem: {
    backgroundColor: COLORS.surface,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: COLORS.border,
    marginBottom: 10,
    overflow: 'hidden',
    elevation: 1,
  },
  cardItemHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 12,
    gap: 8,
  },
  cardItemTitleCol: {
    flex: 1,
  },
  badgeRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 6,
    marginBottom: 4,
  },
  badgeCategoria: {
    backgroundColor: 'rgba(139,30,30,0.1)',
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 4,
  },
  badgeCategoriaText: {
    color: COLORS.primary,
    fontWeight: 'bold',
    fontSize: 11,
  },
  badgeNivel: {
    backgroundColor: COLORS.primary,
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 4,
  },
  badgeNivelText: {
    color: COLORS.white,
    fontWeight: 'bold',
    fontSize: 11,
  },
  badgeEscola: {
    backgroundColor: 'rgba(200,157,60,0.2)',
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 4,
  },
  badgeEscolaText: {
    color: '#8A6414',
    fontWeight: 'bold',
    fontSize: 11,
  },
  badgeTipo: {
    backgroundColor: COLORS.surfaceVariant,
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 4,
  },
  badgeTipoText: {
    color: COLORS.textSecondary,
    fontSize: 11,
    textTransform: 'capitalize',
  },
  badgeRaca: {
    backgroundColor: 'rgba(139,30,30,0.15)',
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 4,
  },
  badgeRacaText: {
    color: COLORS.primaryDark,
    fontWeight: 'bold',
    fontSize: 11,
  },
  badgeClasseBasica: {
    backgroundColor: 'rgba(25,118,210,0.15)',
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 4,
  },
  badgeClasseBasicaText: {
    color: '#1565C0',
    fontWeight: 'bold',
    fontSize: 11,
  },
  badgePrestigio: {
    backgroundColor: 'rgba(123,31,162,0.15)',
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 4,
  },
  badgePrestigioText: {
    color: '#6A1B9A',
    fontWeight: 'bold',
    fontSize: 11,
  },
  badgeEquipTipo: {
    backgroundColor: 'rgba(46,125,50,0.15)',
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 4,
  },
  badgeEquipTipoText: {
    color: '#2E7D32',
    fontWeight: 'bold',
    fontSize: 11,
  },
  badgeLivro: {
    backgroundColor: COLORS.surfaceVariant,
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 4,
  },
  badgeLivroText: {
    color: COLORS.textSecondary,
    fontSize: 11,
  },
  badgePossui: {
    backgroundColor: 'rgba(46,107,62,0.15)',
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 4,
  },
  badgePossuiText: {
    color: COLORS.success,
    fontWeight: 'bold',
    fontSize: 11,
  },
  cardItemNome: {
    fontSize: 16,
    fontWeight: 'bold',
    color: COLORS.text,
    marginBottom: 2,
  },
  cardItemPreReq: {
    fontSize: 12,
    color: COLORS.textSecondary,
    marginTop: 2,
  },
  cardItemResumo: {
    fontSize: 12,
    color: COLORS.textSecondary,
    marginTop: 2,
  },
  negrito: {
    fontWeight: 'bold',
    color: COLORS.text,
  },
  atributosRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 6,
    marginVertical: 4,
  },
  attrTag: {
    fontSize: 11,
    color: COLORS.textSecondary,
    backgroundColor: COLORS.surfaceVariant,
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 4,
    fontWeight: '600',
  },
  attrTagVal: {
    fontWeight: 'bold',
    color: COLORS.primary,
  },
  btnAdicionar: {
    backgroundColor: COLORS.primary,
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 6,
    alignItems: 'center',
    justifyContent: 'center',
  },
  btnAdicionarSecundario: {
    backgroundColor: COLORS.success,
    borderWidth: 1,
    borderColor: '#245632',
  },
  btnAdicionarSecundarioText: {
    color: COLORS.white,
    fontWeight: 'bold',
  },
  btnAdicionarText: {
    color: COLORS.white,
    fontWeight: 'bold',
    fontSize: 12,
  },
  previaContainer: {
    paddingHorizontal: 12,
    paddingBottom: 8,
  },
  cardItemBeneficioPrevia: {
    fontSize: 12,
    color: COLORS.textSecondary,
    lineHeight: 17,
  },
  toqueMaisText: {
    fontSize: 11,
    color: COLORS.primary,
    fontWeight: '600',
    marginTop: 4,
  },
  cardItemExpandido: {
    padding: 12,
    paddingTop: 8,
    borderTopWidth: 1,
    borderTopColor: COLORS.border,
    backgroundColor: COLORS.surfaceVariant,
  },
  cardItemDescricaoFlavor: {
    fontSize: 12,
    fontStyle: 'italic',
    color: COLORS.textSecondary,
    marginBottom: 8,
  },
  beneficioBox: {
    backgroundColor: COLORS.surface,
    padding: 10,
    borderRadius: 6,
    borderWidth: 1,
    borderColor: COLORS.border,
    marginBottom: 8,
  },
  beneficioLabel: {
    fontSize: 12,
    fontWeight: 'bold',
    color: COLORS.primary,
    marginBottom: 4,
  },
  beneficioTexto: {
    fontSize: 13,
    color: COLORS.text,
    lineHeight: 18,
  },
  proficienciasBox: {
    backgroundColor: COLORS.surface,
    padding: 8,
    borderRadius: 6,
    borderWidth: 1,
    borderColor: COLORS.border,
    marginBottom: 8,
  },
  secaoTituloInterno: {
    fontSize: 13,
    fontWeight: 'bold',
    color: COLORS.primaryDark,
    marginBottom: 6,
  },
  subItemBox: {
    backgroundColor: COLORS.surface,
    padding: 8,
    borderRadius: 6,
    borderWidth: 1,
    borderColor: COLORS.border,
    marginBottom: 6,
  },
  subItemTitulo: {
    fontSize: 12,
    fontWeight: 'bold',
    color: COLORS.text,
    marginBottom: 2,
  },
  subItemDescricao: {
    fontSize: 12,
    color: COLORS.textSecondary,
    lineHeight: 16,
  },
  magiaGridParametros: {
    backgroundColor: COLORS.surface,
    padding: 10,
    borderRadius: 6,
    borderWidth: 1,
    borderColor: COLORS.border,
    marginBottom: 8,
    gap: 4,
  },
  equipGridParametros: {
    backgroundColor: COLORS.surface,
    padding: 10,
    borderRadius: 6,
    borderWidth: 1,
    borderColor: COLORS.border,
    marginBottom: 8,
    gap: 4,
  },
  magiaParamItem: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 4,
  },
  paramLabel: {
    fontSize: 12,
    fontWeight: 'bold',
    color: COLORS.text,
  },
  paramVal: {
    fontSize: 12,
    color: COLORS.textSecondary,
    flex: 1,
  },
  btnRecolher: {
    alignSelf: 'center',
    paddingVertical: 6,
    paddingHorizontal: 16,
    marginTop: 4,
  },
  btnRecolherText: {
    fontSize: 12,
    color: COLORS.textSecondary,
    fontWeight: 'bold',
  },
  emptyWrap: {
    padding: 32,
    alignItems: 'center',
  },
  emptyText: {
    fontSize: 14,
    color: COLORS.textSecondary,
    textAlign: 'center',
  },
  modalBackdrop: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  dialogCard: {
    width: '100%',
    maxWidth: 480,
    maxHeight: '80%',
    backgroundColor: COLORS.surface,
    borderRadius: 12,
    padding: 16,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  dialogTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: COLORS.primary,
    marginBottom: 4,
  },
  dialogSubtitle: {
    fontSize: 13,
    color: COLORS.textSecondary,
    marginBottom: 12,
  },
  dialogScroll: {
    maxHeight: 280,
    marginBottom: 12,
  },
  dialogFichaItem: {
    padding: 12,
    borderRadius: 8,
    backgroundColor: COLORS.surfaceVariant,
    marginBottom: 8,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  dialogFichaNome: {
    fontSize: 15,
    fontWeight: 'bold',
    color: COLORS.text,
  },
  dialogFichaDetalhes: {
    fontSize: 12,
    color: COLORS.textSecondary,
    marginTop: 2,
  },
  dialogBtnCancelar: {
    paddingVertical: 10,
    alignItems: 'center',
    borderRadius: 8,
    backgroundColor: 'rgba(139,30,30,0.1)',
  },
  dialogBtnCancelarText: {
    color: COLORS.primary,
    fontWeight: 'bold',
    fontSize: 14,
  },
  filtroPersonagemRow: {
    paddingHorizontal: 8,
    paddingTop: 6,
  },
  btnFiltroPreReq: {
    backgroundColor: 'rgba(200,157,60,0.12)',
    borderColor: COLORS.gold,
    borderWidth: 1,
    paddingHorizontal: 12,
    paddingVertical: 7,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
  },
  btnFiltroPreReqAtivo: {
    backgroundColor: COLORS.gold,
    borderColor: '#8A6414',
  },
  btnFiltroPreReqText: {
    fontSize: 12,
    fontWeight: 'bold',
    color: '#8A6414',
  },
  btnFiltroPreReqTextAtivo: {
    color: '#1F1A17',
  },
  badgeReqStatus: {
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 4,
  },
  badgeReqCumpre: {
    backgroundColor: 'rgba(46,125,50,0.15)',
  },
  badgeReqPendente: {
    backgroundColor: 'rgba(211,47,47,0.12)',
  },
  badgeReqStatusText: {
    fontSize: 10,
    fontWeight: 'bold',
  },
  badgeReqCumpreText: {
    color: '#2E7D32',
  },
  badgeReqPendenteText: {
    color: '#C62828',
  },
  chipsPreReqRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    alignItems: 'center',
    gap: 6,
    marginTop: 6,
  },
  chipsPreReqLabel: {
    fontSize: 11,
    color: COLORS.textSecondary,
    fontStyle: 'italic',
  },
  chipPreReqBtn: {
    backgroundColor: 'rgba(30,136,229,0.14)',
    borderColor: '#1E88E5',
    borderWidth: 1,
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 12,
  },
  chipPreReqBtnText: {
    fontSize: 11,
    fontWeight: 'bold',
    color: '#1565C0',
  },
  pendenciasBox: {
    backgroundColor: 'rgba(211,47,47,0.08)',
    borderRadius: 6,
    padding: 8,
    marginBottom: 8,
    borderLeftWidth: 3,
    borderLeftColor: '#C62828',
  },
  pendenciasTitulo: {
    fontSize: 11.5,
    fontWeight: 'bold',
    color: '#C62828',
    marginBottom: 4,
  },
  pendenciaItem: {
    fontSize: 11,
    color: '#B71C1C',
    marginLeft: 4,
    lineHeight: 16,
  },
  talentoDetalheDialog: {
    width: '92%',
    maxWidth: 580,
    maxHeight: '85%',
    backgroundColor: COLORS.surface,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: COLORS.border,
    padding: 16,
  },
  talentoDetalheHeader: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    justifyContent: 'space-between',
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
    paddingBottom: 10,
    marginBottom: 10,
    gap: 8,
  },
  talentoDetalheHeaderCol: {
    flex: 1,
  },
  talentoDetalheTitulo: {
    fontSize: 17,
    fontWeight: 'bold',
    color: COLORS.primary,
    marginTop: 4,
  },
  btnFecharDetalhe: {
    width: 30,
    height: 30,
    borderRadius: 15,
    backgroundColor: 'rgba(0,0,0,0.06)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  btnFecharDetalheText: {
    fontSize: 15,
    fontWeight: 'bold',
    color: COLORS.textSecondary,
  },
  talentoDetalheScroll: {
    maxHeight: 360,
    marginBottom: 12,
  },
  talentoDetalheSecao: {
    marginBottom: 10,
  },
  talentoDetalheSecaoLabel: {
    fontSize: 12,
    fontWeight: 'bold',
    color: COLORS.textSecondary,
    marginBottom: 2,
    textTransform: 'uppercase',
  },
  talentoDetalhePreReqText: {
    fontSize: 13,
    color: COLORS.text,
    lineHeight: 18,
  },
  talentoDetalheBeneficioText: {
    fontSize: 13,
    color: COLORS.text,
    lineHeight: 19,
  },
  talentoDetalheFooter: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-end',
    gap: 10,
    borderTopWidth: 1,
    borderTopColor: COLORS.border,
    paddingTop: 10,
  },
});
