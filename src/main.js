// Configuration
const SPREADSHEET_ID = '1dYFIQCIcVmyEwN4u6_So5z36xMUS8Yo-M2tzqW0DcJs';
const SHEET_NAME = 'publicadores';
const SCOPES = 'https://www.googleapis.com/auth/spreadsheets https://www.googleapis.com/auth/userinfo.email';

// Spanish months generator helper for Spanish periods (of the last 6 months starting from last month)
function getPeriods() {
  const fullMonths = ['Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio', 'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'];
  const shortMonths = ['Ene', 'Feb', 'Mar', 'Abr', 'May', 'Jun', 'Jul', 'Ago', 'Sep', 'Oct', 'Nov', 'Dic'];
  const altShortMonths = ['Ene', 'Feb', 'Mar', 'Abr', 'May', 'Jun', 'Jul', 'Ago', 'Set', 'Oct', 'Nov', 'Dic'];
  const periods = [];
  const now = new Date();
  
  for (let i = 1; i <= 6; i++) {
    const d = new Date(now.getFullYear(), now.getMonth() - i, 1);
    const fullMonthName = fullMonths[d.getMonth()];
    const shortMonthName = shortMonths[d.getMonth()];
    const altShortMonthName = altShortMonths[d.getMonth()];
    const fullYear = d.getFullYear();
    const shortYear = fullYear % 100;

    const value = `${fullMonthName} ${fullYear}`;
    const prefix = `${shortMonthName} ${shortYear}`;
    const altPrefix = `${altShortMonthName} ${shortYear}`;

    periods.push({
      value: value,
      label: value,
      prefix: prefix,
      altPrefix: altPrefix,
      isEditable: i === 1,
    });
  }
  return periods;
}

const PERIODS = getPeriods();
const DEFAULT_PERIOD = PERIODS[0].value;

// Google Client ID
const CLIENT_ID = '241558307299-e146vcp9cuvjfcm50acv3kv4aigciome.apps.googleusercontent.com';

// Configuration for S-21-S Tarjetas Publicador (24 months for 2025 and 2026 Service Years)
const MONTH_CONFIGS = [
  { prefix: 'Set 24', altPrefix: 'Sep 24', shortLabel: 'Set 24', label: 'Septiembre', year: 2024, serviceYear: 2025, index: 0, key: '2024-09' },
  { prefix: 'Oct 24', altPrefix: 'Oct 24', shortLabel: 'Oct 24', label: 'Octubre', year: 2024, serviceYear: 2025, index: 1, key: '2024-10' },
  { prefix: 'Nov 24', altPrefix: 'Nov 24', shortLabel: 'Nov 24', label: 'Noviembre', year: 2024, serviceYear: 2025, index: 2, key: '2024-11' },
  { prefix: 'Dic 24', altPrefix: 'Dic 24', shortLabel: 'Dic 24', label: 'Diciembre', year: 2024, serviceYear: 2025, index: 3, key: '2024-12' },
  { prefix: 'Ene 25', altPrefix: 'Ene 25', shortLabel: 'Ene 25', label: 'Enero', year: 2025, serviceYear: 2025, index: 4, key: '2025-01' },
  { prefix: 'Feb 25', altPrefix: 'Feb 25', shortLabel: 'Feb 25', label: 'Febrero', year: 2025, serviceYear: 2025, index: 5, key: '2025-02' },
  { prefix: 'Mar 25', altPrefix: 'Mar 25', shortLabel: 'Mar 25', label: 'Marzo', year: 2025, serviceYear: 2025, index: 6, key: '2025-03' },
  { prefix: 'Abr 25', altPrefix: 'Abr 25', shortLabel: 'Abr 25', label: 'Abril', year: 2025, serviceYear: 2025, index: 7, key: '2025-04' },
  { prefix: 'May 25', altPrefix: 'May 25', shortLabel: 'May 25', label: 'Mayo', year: 2025, serviceYear: 2025, index: 8, key: '2025-05' },
  { prefix: 'Jun 25', altPrefix: 'Jun 25', shortLabel: 'Jun 25', label: 'Junio', year: 2025, serviceYear: 2025, index: 9, key: '2025-06' },
  { prefix: 'Jul 25', altPrefix: 'Jul 25', shortLabel: 'Jul 25', label: 'Julio', year: 2025, serviceYear: 2025, index: 10, key: '2025-07' },
  { prefix: 'Ago 25', altPrefix: 'Ago 25', shortLabel: 'Ago 25', label: 'Agosto', year: 2025, serviceYear: 2025, index: 11, key: '2025-08' },

  { prefix: 'Sep 25', altPrefix: 'Set 25', shortLabel: 'Sep 25', label: 'Septiembre', year: 2025, serviceYear: 2026, index: 0, key: '2025-09' },
  { prefix: 'Oct 25', altPrefix: 'Oct 25', shortLabel: 'Oct 25', label: 'Octubre', year: 2025, serviceYear: 2026, index: 1, key: '2025-10' },
  { prefix: 'Nov 25', altPrefix: 'Nov 25', shortLabel: 'Nov 25', label: 'Noviembre', year: 2025, serviceYear: 2026, index: 2, key: '2025-11' },
  { prefix: 'Dic 25', altPrefix: 'Dic 25', shortLabel: 'Dic 25', label: 'Diciembre', year: 2025, serviceYear: 2026, index: 3, key: '2025-12' },
  { prefix: 'Ene 26', altPrefix: 'Ene 26', shortLabel: 'Ene 26', label: 'Enero', year: 2026, serviceYear: 2026, index: 4, key: '2026-01' },
  { prefix: 'Feb 26', altPrefix: 'Feb 26', shortLabel: 'Feb 26', label: 'Febrero', year: 2026, serviceYear: 2026, index: 5, key: '2026-02' },
  { prefix: 'Mar 26', altPrefix: 'Mar 26', shortLabel: 'Mar 26', label: 'Marzo', year: 2026, serviceYear: 2026, index: 6, key: '2026-03' },
  { prefix: 'Abr 26', altPrefix: 'Abr 26', shortLabel: 'Abr 26', label: 'Abril', year: 2026, serviceYear: 2026, index: 7, key: '2026-04' },
  { prefix: 'May 26', altPrefix: 'May 26', shortLabel: 'May 26', label: 'Mayo', year: 2026, serviceYear: 2026, index: 8, key: '2026-05' },
  { prefix: 'Jun 26', altPrefix: 'Jun 26', shortLabel: 'Jun 26', label: 'Junio', year: 2026, serviceYear: 2026, index: 9, key: '2026-06' },
  { prefix: 'Jul 26', altPrefix: 'Jul 26', shortLabel: 'Jul 26', label: 'Julio', year: 2026, serviceYear: 2026, index: 10, key: '2026-07' },
  { prefix: 'Ago 26', altPrefix: 'Ago 26', shortLabel: 'Ago 26', label: 'Agosto', year: 2026, serviceYear: 2026, index: 11, key: '2026-08' },
];

const initialGroupNumber = localStorage.getItem('group_number') ? parseInt(localStorage.getItem('group_number'), 10) : 1;

let state = {
  accessToken: localStorage.getItem('sheets_access_token'),
  userEmail: localStorage.getItem('user_email'),
  groupNumber: initialGroupNumber,
  selectedPeriod: DEFAULT_PERIOD,
  currentView: window.location.hash === '#cards' ? 'cards' : 'table',
  fetchingInfo: false,
  data: [],
  fullPublishers: [],
  headers: [],
  loading: false,
  error: null,
  searchTerm: "",
  saving: null,
  // Tarjetas view state
  cardsSelectedGroup: initialGroupNumber,
  cardsSearchTerm: "",
  cardsSelectedPubId: "",
  cardsServiceYear: 2026,
};

// --- Google Sheets Service Logic ---
async function fetchWithAuth(url, options = {}) {
  if (!state.accessToken) {
    throw new Error('401: Sesión expirada o no autenticado');
  }
  const headers = {
    ...options.headers,
    Authorization: `Bearer ${state.accessToken}`,
    'Content-Type': 'application/json',
  };
  const response = await fetch(url, { ...options, headers });
  if (!response.ok) {
    if (response.status === 401) {
      localStorage.removeItem('sheets_access_token');
      localStorage.removeItem('user_email');
      state.accessToken = null;
      state.userEmail = null;
    }
    const error = await response.json().catch(() => ({}));
    const message = error.error?.message || 'Error de la API de Google Sheets';
    throw new Error(`${response.status}: ${message}`);
  }
  return response.json();
}

async function getSheetData() {
  const data = await fetchWithAuth(
    `https://sheets.googleapis.com/v4/spreadsheets/${SPREADSHEET_ID}/values/${SHEET_NAME}!A1:ZZ1000`
  );
  return {
    headers: data.values ? data.values[1] : [],
    rows: data.values || [],
  };
}

async function updateCell(range, value) {
  return fetchWithAuth(
    `https://sheets.googleapis.com/v4/spreadsheets/${SPREADSHEET_ID}/values/${SHEET_NAME}!${range}?valueInputOption=USER_ENTERED`,
    {
      method: 'PUT',
      body: JSON.stringify({
        values: [[value]],
      }),
    }
  );
}

function getColumnLetter(index) {
  let letter = "";
  let i = index;
  while (i >= 0) {
    letter = String.fromCharCode((i % 26) + 65) + letter;
    i = Math.floor(i / 26) - 1;
  }
  return letter;
}

function formatDateForCard(dateStr) {
  if (!dateStr || !dateStr.trim()) return '—';
  const clean = dateStr.trim();
  const parts = clean.split('/');
  if (parts.length < 3) return dateStr;

  let day = parseInt(parts[0], 10);
  let monthNum = parseInt(parts[1], 10);
  let yearNum = parseInt(parts[2], 10);

  if (isNaN(day) || isNaN(monthNum) || isNaN(yearNum)) return dateStr;

  if (yearNum < 100) {
    yearNum = yearNum > 30 ? 1900 + yearNum : 2000 + yearNum;
  }

  const monthNames = [
    'Ene', 'Feb', 'Mar', 'Abr', 'May', 'Jun',
    'Jul', 'Ago', 'Sep', 'Oct', 'Nov', 'Dic'
  ];

  const monthAbbr = monthNames[monthNum - 1] || `${monthNum}`;
  const dayPadded = day < 10 ? `0${day}` : `${day}`;

  return `${dayPadded} ${monthAbbr} ${yearNum}`;
}

function isPioneerInServiceYear(pub, serviceYear) {
  const yearMonths = MONTH_CONFIGS.filter(m => m.serviceYear === serviceYear);
  for (let i = yearMonths.length - 1; i >= 0; i--) {
    const act = pub.monthlyData[yearMonths[i].key];
    if (act && act.pioneerType && act.pioneerType.toLowerCase().includes('regular')) {
      return true;
    }
  }
  return false;
}

// --- App Logic ---
function getFriendlyError(err) {
  const msg = (err.message || err.toString() || '').toLowerCase();
  if (msg.includes('403') || msg.includes('permission') || msg.includes('scopes')) {
    return 'No tiene permisos suficientes. Al conectar con Google, asegúrese de marcar todas las casillas de verificación de permisos solicitados para que la aplicación pueda funcionar correctamente.';
  }
  if (msg.includes('401') || msg.includes('invalid authentication credentials') || msg.includes('unauthenticated') || msg.includes('invalid_grant')) {
    return 'Sesión expirada o inválida. Por favor inicie sesión nuevamente.';
  }
  return err.message || 'Ocurrió un error inesperado.';
}

async function fetchGroupConfig(email) {
  try {
    const configUrl = 'https://sheets.googleapis.com/v4/spreadsheets/1TXTFt4uPkygz9MOxeogkfWy4p4WTqDWLDUYqluEQhXg/values/publicadores?key=AIzaSyD37ddBLRxw48pq0CLXYd2LIjUrneaKk5s';
    const response = await fetch(configUrl);
    const data = await response.json();
    
    const isSpecialUser = email.toLowerCase() === 'ismaelmachado@gmail.com';

    if (!data || !data.values || data.values.length === 0) return isSpecialUser ? 1 : null;

    const rows = data.values;
    const headers = rows[0].map(h => h.trim().toLowerCase());
    
    const emailIndex = headers.indexOf('correo electrónico');
    const groupIndex = headers.indexOf('grupo');

    if (emailIndex === -1 || groupIndex === -1) {
      for (const row of rows) {
        const foundEmailIndex = row.findIndex(c => c.trim().toLowerCase() === email.toLowerCase());
        if (foundEmailIndex !== -1) {
          const gCol = row.findIndex((c, idx) => idx !== foundEmailIndex && !isNaN(parseInt(c)) && parseInt(c) < 100);
          if (gCol !== -1) { 
            const group = parseInt(row[gCol]);
            return group || 1;
          }
        }
      }
      return isSpecialUser ? 1 : null;
    }

    for (let i = 1; i < rows.length; i++) {
      const row = rows[i];
      if (row[emailIndex] && row[emailIndex].trim().toLowerCase() === email.toLowerCase()) {
        const group = parseInt(row[groupIndex]);
        return group || 1;
      }
    }
    
    return isSpecialUser ? 1 : null;
  } catch (err) {
    console.error('Error fetching group config:', err);
    return (email.toLowerCase() === 'ismaelmachado@gmail.com') ? 1 : null;
  }
}

function setState(newState) {
  state = { ...state, ...newState };
  render();
}

async function loadData() {
  if (!state.accessToken) return;
  
  setState({ loading: true, error: null });
  try {
    const { rows, headers } = await getSheetData();
    const findCol = (name) => {
      const cleanedHeaders = headers.map(h => (h || '').toString().trim().toLowerCase());
      const lowerName = name.toLowerCase();
      const exactIdx = cleanedHeaders.indexOf(lowerName);
      if (exactIdx !== -1) return exactIdx;
      return cleanedHeaders.findIndex(h => h.includes(lowerName));
    };

    // Table view columns
    const idxNombre = findCol('publicador');
    const idxGrupo = findCol('grupo');

    const selectedPeriodObj = PERIODS.find(p => p.value === state.selectedPeriod) || PERIODS[0];
    const periodPrefix = selectedPeriodObj ? selectedPeriodObj.prefix : state.selectedPeriod;
    const periodAltPrefix = selectedPeriodObj ? selectedPeriodObj.altPrefix : null;

    const findPeriodCol = (suffix) => {
      let idx = findCol(`${periodPrefix} ${suffix}`);
      if (idx === -1 && periodAltPrefix) {
        idx = findCol(`${periodAltPrefix} ${suffix}`);
      }
      if (idx === -1) {
        idx = findCol(`${state.selectedPeriod} ${suffix}`);
      }
      return idx;
    };

    const idxParticipo = findPeriodCol('participó');
    const idxCursos = findPeriodCol('cursos');
    const idxPrecursorado = findPeriodCol('precursorado');
    const idxHoras = findPeriodCol('horas');
    const idxNotas = findPeriodCol('notas');

    const publishers = rows
      .slice(2)
      .map((row, i) => ({
        rowIndex: i + 3,
        id: `row-${i + 3}`,
        nombre: idxNombre !== -1 ? (row[idxNombre] || '').toString().trim() : '',
        grupo: idxNombre !== -1 ? (row[idxGrupo] || '').toString().trim() : '',
        participo: idxParticipo !== -1 ? ['sí', 'true', '1', 'yes'].includes((row[idxParticipo] || '').toString().toLowerCase().trim()) : false,
        cursos: idxCursos !== -1 ? parseInt(row[idxCursos]) || 0 : 0,
        precursorado: idxPrecursorado !== -1 ? (row[idxPrecursorado] || '').toString().trim() : '',
        horas: idxHoras !== -1 ? parseInt(row[idxHoras]) || 0 : 0,
        notas: idxNotas !== -1 ? (row[idxNotas] || '').toString().trim() : '',
      }))
      .filter(p => p.nombre !== '');

    // Parse Full Publishers for S-21-S Tarjetas
    const idxWhatsApp = findCol('whatsapp');
    const idxNacimiento = findCol('nacimiento');
    const idxBautismo = findCol('bautismo');
    const idxGender = findCol('h/m');
    const idxEsperanza = findCol('esperanza');
    const idxNombramiento = findCol('nombramiento');
    const idxFamilia = findCol('familia');

    const fullPublishers = rows
      .slice(2)
      .map((row, i) => {
        const nameVal = idxNombre !== -1 ? (row[idxNombre] || '').toString().trim() : '';
        if (!nameVal) return null;

        const groupVal = idxGrupo !== -1 ? (row[idxGrupo] || '').toString().trim() : '1';
        const grupoNum = parseInt(groupVal, 10) || 1;
        const whatsappVal = idxWhatsApp !== -1 ? (row[idxWhatsApp] || '').toString().trim() : '';
        const birthVal = idxNacimiento !== -1 ? (row[idxNacimiento] || '').toString().trim() : '';
        const baptismVal = idxBautismo !== -1 ? (row[idxBautismo] || '').toString().trim() : '';
        const genderVal = idxGender !== -1 ? (row[idxGender] || '').toString().trim().toUpperCase() : 'M';
        const hopeVal = idxEsperanza !== -1 ? (row[idxEsperanza] || '').toString().trim() : '';
        const nombVal = idxNombramiento !== -1 ? (row[idxNombramiento] || '').toString().trim().toUpperCase() : '';
        const familyVal = idxFamilia !== -1 ? (row[idxFamilia] || '').toString().trim() : '';

        let appointment = null;
        if (nombVal === 'A' || nombVal.includes('ANCIANO')) appointment = 'A';
        else if (nombVal === 'SM' || nombVal.includes('SIERVO')) appointment = 'SM';

        const monthlyData = {};
        MONTH_CONFIGS.forEach(m => {
          const findColOrAlt = (suffix) => {
            let idx = findCol(`${m.prefix} ${suffix}`);
            if (idx === -1 && m.altPrefix) {
              idx = findCol(`${m.altPrefix} ${suffix}`);
            }
            return idx;
          };

          const cParticipo = findColOrAlt('participó');
          const cCursos = findColOrAlt('cursos');
          const cPrecursorado = findColOrAlt('precursorado');
          const cHoras = findColOrAlt('horas');
          const cNotas = findColOrAlt('notas');

          const pRaw = cParticipo !== -1 ? (row[cParticipo] || '').toString().toLowerCase().trim() : '';
          const partBool = ['sí', 'si', 'true', '1', 'yes', 'x', '✓'].includes(pRaw);

          const cRaw = cCursos !== -1 ? (row[cCursos] || '').toString().trim() : '';
          const cursosNum = cRaw !== '' && !isNaN(parseInt(cRaw, 10)) ? parseInt(cRaw, 10) : null;

          const precStr = cPrecursorado !== -1 ? (row[cPrecursorado] || '').toString().trim() : '';
          
          const hRaw = cHoras !== -1 ? (row[cHoras] || '').toString().trim() : '';
          const horasNum = hRaw !== '' && !isNaN(parseFloat(hRaw)) ? parseFloat(hRaw) : null;

          const notasStr = cNotas !== -1 ? (row[cNotas] || '').toString().trim() : '';

          monthlyData[m.key] = {
            monthKey: m.key,
            monthLabel: m.label,
            shortLabel: m.prefix,
            serviceYear: m.serviceYear,
            year: m.year,
            index: m.index,
            participated: partBool,
            bibleStudies: cursosNum,
            pioneerType: precStr || null,
            isAuxiliaryPioneer: precStr ? precStr.toLowerCase().includes('auxiliar') : false,
            hours: horasNum,
            notes: notasStr || null,
            colIndices: {
              participo: cParticipo,
              cursos: cCursos,
              precursorado: cPrecursorado,
              horas: cHoras,
              notas: cNotas,
            }
          };
        });

        return {
          rowIndex: i + 3,
          id: `pub-${i + 3}-${nameVal.toLowerCase().replace(/[^a-z0-9]/g, '-')}`,
          nombre: nameVal,
          grupo: grupoNum,
          whatsapp: whatsappVal,
          birthDate: birthVal,
          baptismDate: baptismVal,
          gender: genderVal === 'H' ? 'H' : 'M',
          appointment,
          family: familyVal,
          hope: hopeVal || 'Otras ovejas',
          monthlyData,
          colIndices: {
            nombre: idxNombre,
            grupo: idxGrupo,
            whatsapp: idxWhatsApp,
            nacimiento: idxNacimiento,
            bautismo: idxBautismo,
            h_m: idxGender,
            esperanza: idxEsperanza,
            nombramiento: idxNombramiento,
            familia: idxFamilia,
          }
        };
      })
      .filter(Boolean);

    let selectedPubId = state.cardsSelectedPubId;
    if (!selectedPubId || !fullPublishers.some(p => p.id === selectedPubId)) {
      if (fullPublishers.length > 0) {
        selectedPubId = fullPublishers[0].id;
      }
    }

    setState({
      data: publishers,
      fullPublishers,
      headers,
      loading: false,
      cardsSelectedPubId: selectedPubId
    });
  } catch (err) {
    console.error(err);
    const friendlyMsg = getFriendlyError(err);
    if (friendlyMsg.includes('Sesión expirada') || (err.message && err.message.includes('401'))) {
      logout();
      setState({ error: 'Sesión expirada o inválida. Por favor vuelva a conectar con Google.', loading: false });
    } else {
      setState({ error: friendlyMsg, loading: false });
    }
  }
}

function login() {
  if (!CLIENT_ID) {
    setState({ error: 'Google Client ID no configurado.' });
    return;
  }

  const client = window.google.accounts.oauth2.initTokenClient({
    client_id: CLIENT_ID,
    scope: SCOPES,
    callback: async (response) => {
      if (response.access_token) {
        localStorage.setItem('sheets_access_token', response.access_token);
        
        setState({ 
          accessToken: response.access_token, 
          loading: true, 
          fetchingInfo: true,
          error: null 
        });
        
        try {
          const userResponse = await fetch('https://www.googleapis.com/oauth2/v3/userinfo', {
            headers: { Authorization: `Bearer ${response.access_token}` }
          });
          
          if (!userResponse.ok) {
            const errorData = await userResponse.json();
            throw new Error(`${userResponse.status}: ${errorData.error_description || errorData.error?.message || 'Error obteniendo datos del usuario'}`);
          }

          const userData = await userResponse.json();
          const email = userData.email || '';
          
          if (!email) {
            throw new Error('No se pudo obtener el correo electrónico del usuario.');
          }

          const groupNumber = await fetchGroupConfig(email);
          
          if (groupNumber === null) {
            logout();
            setState({ 
              error: 'No pudimos encontrar su mail en los registros',
              fetchingInfo: false
            });
            return;
          }
          
          localStorage.setItem('user_email', email);
          localStorage.setItem('group_number', groupNumber);
          
          setState({ 
            userEmail: email, 
            groupNumber: groupNumber,
            cardsSelectedGroup: groupNumber,
            fetchingInfo: false
          });
          loadData();
        } catch (err) {
          console.error('Error fetching user info:', err);
          const friendlyMsg = getFriendlyError(err);
          if (friendlyMsg.includes('Sesión expirada')) {
            logout();
          }
          setState({ fetchingInfo: false, error: friendlyMsg });
        }
      }
    },
    error_callback: (err) => {
      console.error('OAuth Error:', err);
      setState({ error: `Error de Autenticación: ${err.message || 'Client ID inválido'}` });
    }
  });
  client.requestAccessToken();
}

function logout() {
  localStorage.removeItem('sheets_access_token');
  localStorage.removeItem('user_email');
  localStorage.removeItem('group_number');
  setState({ accessToken: null, userEmail: null, groupNumber: 1, cardsSelectedGroup: 1, data: [], fullPublishers: [], headers: [] });
}

async function handleUpdate(pub, field, value) {
  const saveKey = `${pub.id}-${field}`;
  setState({ saving: saveKey });
  
  try {
    const selectedPeriodObj = PERIODS.find(p => p.value === state.selectedPeriod) || PERIODS[0];
    const periodPrefix = selectedPeriodObj ? selectedPeriodObj.prefix : state.selectedPeriod;
    const periodAltPrefix = selectedPeriodObj ? selectedPeriodObj.altPrefix : null;

    const findColForPeriod = (suffix) => {
      let idx = state.headers.findIndex(h => (h || '').trim().toLowerCase().includes(`${periodPrefix} ${suffix}`.toLowerCase()));
      if (idx === -1 && periodAltPrefix) {
        idx = state.headers.findIndex(h => (h || '').trim().toLowerCase().includes(`${periodAltPrefix} ${suffix}`.toLowerCase()));
      }
      if (idx === -1) {
        idx = state.headers.findIndex(h => (h || '').trim().toLowerCase().includes(`${state.selectedPeriod} ${suffix}`.toLowerCase()));
      }
      return idx;
    };

    let colIdx = -1;
    if (field === 'participo') colIdx = findColForPeriod('participó');
    else if (field === 'cursos') colIdx = findColForPeriod('cursos');
    else if (field === 'precursorado') colIdx = findColForPeriod('precursorado');
    else if (field === 'horas') colIdx = findColForPeriod('horas');
    else if (field === 'notas') colIdx = findColForPeriod('notas');

    if (colIdx === -1) throw new Error(`Columna para ${field} no encontrada`);

    const colLetter = getColumnLetter(colIdx);
    const range = `${colLetter}${pub.rowIndex}`;

    let valToSave = value;
    if (field === 'participo') {
      valToSave = value ? 'TRUE' : 'FALSE';
    }

    await updateCell(range, valToSave);

    const updatedData = state.data.map(p => {
      if (p.id === pub.id) {
        return { ...p, [field]: value };
      }
      return p;
    });

    setState({ data: updatedData, saving: null });
  } catch (err) {
    console.error(err);
    const friendlyMsg = getFriendlyError(err);
    if (friendlyMsg.includes('Sesión expirada')) {
      logout();
    }
    setState({ saving: null, error: `Error guardando: ${friendlyMsg}` });
  }
}

// --- Views ---
function LoginView() {
  return `
    <div class="min-h-screen bg-slate-50 flex items-center justify-center p-4">
      <div class="max-w-md w-full bg-white rounded-3xl p-8 border border-slate-200 shadow-xl text-center">
        <div class="w-16 h-16 bg-indigo-50 text-indigo-600 rounded-2xl flex items-center justify-center mx-auto mb-6">
          <i data-lucide="file-spreadsheet" class="w-8 h-8"></i>
        </div>
        <h1 class="text-2xl font-bold text-slate-900 mb-2">Informes de Servicio</h1>
        <p class="text-slate-500 mb-8">Conecte con Google Sheets para gestionar los informes de servicio y las tarjetas de publicador.</p>
        
        ${state.error ? `
          <div class="bg-red-50 border border-red-200 rounded-xl p-3 mb-6 text-xs text-red-700 text-left">
            ${state.error}
          </div>
        ` : ''}

        <button id="login-btn" class="w-full py-4 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl font-bold tracking-wide transition-all shadow-lg shadow-indigo-200 flex items-center justify-center gap-3 cursor-pointer">
          <svg class="w-5 h-5" viewBox="0 0 24 24"><path fill="currentColor" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" /><path fill="currentColor" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" /><path fill="currentColor" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z" /><path fill="currentColor" d="M12 5.38c1.62 0 3.06.56 4.21 1.66l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" /></svg>
          Conectar con Google
        </button>

        <div class="mt-8 pt-6 border-t border-slate-100 flex justify-center gap-4 text-[11px] text-slate-400 font-medium">
          <a href="privacy.html" class="hover:text-indigo-600 transition-colors">Privacidad</a>
          <span class="text-slate-200">•</span>
          <a href="terms.html" class="hover:text-indigo-600 transition-colors">Condiciones</a>
        </div>
      </div>
    </div>
  `;
}

function MainHeader() {
  const currentGroup = state.groupNumber.toString();
  return `
    <header class="bg-white border-b border-slate-200 px-4 sm:px-10 py-3 sm:py-0 sm:h-20 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 sm:gap-4 flex-shrink-0 print:hidden">
      <!-- Top Row on Mobile: Group Badge + Title & Subtitle on Left, Logout on Right -->
      <div class="flex items-center justify-between sm:justify-start gap-4 w-full sm:w-auto">
        <div class="flex items-center gap-3 sm:gap-4">
          ${state.fetchingInfo ? `
            <div class="w-10 h-10 bg-slate-100 rounded-xl flex items-center justify-center ring-4 ring-slate-50 animate-pulse">
              <div class="w-4 h-4 bg-slate-200 rounded"></div>
            </div>
          ` : `
            <div class="w-10 h-10 bg-indigo-600 rounded-xl flex items-center justify-center text-white font-bold text-xl ring-4 ring-indigo-50">${currentGroup}</div>
          `}
          <div>
            <h1 class="text-lg sm:text-xl font-bold tracking-tight text-slate-900 leading-tight">Informes de Servicio</h1>
            ${state.fetchingInfo ? `
              <div class="h-3 w-24 bg-slate-100 rounded mt-1 animate-pulse"></div>
            ` : `
              <p class="text-[11px] sm:text-xs text-slate-500 uppercase tracking-widest font-semibold">Grupo ${currentGroup} • Shangrilá</p>
            `}
          </div>
        </div>

        <!-- Mobile Logout button -->
        <button class="logout-btn sm:hidden p-2 text-slate-400 hover:text-red-500 transition-colors bg-slate-50 rounded-xl cursor-pointer" title="Cerrar sesión">
          <i data-lucide="log-out" class="w-5 h-5"></i>
        </button>
      </div>

      <!-- Navigation buttons (Informes / Tarjetas) below title on mobile, right side on desktop -->
      <div class="flex items-center justify-between sm:justify-end gap-2 sm:gap-4 w-full sm:w-auto">
        <div class="bg-slate-100 p-1 rounded-xl flex items-center gap-1 border border-slate-200 w-full sm:w-auto">
          <button id="view-table-btn" class="flex-1 sm:flex-initial px-3.5 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center justify-center gap-1.5 cursor-pointer ${state.currentView === 'table' ? 'bg-white text-indigo-600 shadow-xs' : 'text-slate-600 hover:text-slate-900'}">
            <i data-lucide="table" class="w-4 h-4"></i>
            <span>Informes</span>
          </button>
          <button id="view-cards-btn" class="flex-1 sm:flex-initial px-3.5 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center justify-center gap-1.5 cursor-pointer ${state.currentView === 'cards' ? 'bg-white text-indigo-600 shadow-xs' : 'text-slate-600 hover:text-slate-900'}">
            <i data-lucide="contact" class="w-4 h-4"></i>
            <span class="sm:hidden">Tarjetas</span>
            <span class="hidden sm:inline">Tarjetas Publicador</span>
          </button>
        </div>

        <!-- Desktop Logout button -->
        <button class="logout-btn hidden sm:flex p-2 text-slate-400 hover:text-red-500 transition-colors bg-slate-50 rounded-xl cursor-pointer" title="Cerrar sesión">
          <i data-lucide="log-out" class="w-5 h-5"></i>
        </button>
      </div>
    </header>
  `;
}

function StatCard(title, value) {
  return `
    <div class="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs">
      <p class="text-xs text-slate-500 font-semibold uppercase tracking-wider mb-1">${title}</p>
      <p class="text-3xl font-extrabold text-slate-900">${value}</p>
    </div>
  `;
}

function TableView() {
  const currentGroup = state.groupNumber.toString();
  const isPeriodEditable = PERIODS.find(p => p.value === state.selectedPeriod)?.isEditable ?? false;
  const groupData = state.data.filter(p => {
    const norm = p.grupo.toString().trim();
    const isCurrentGroup = norm === currentGroup || norm === `${currentGroup}.0` || norm.toLowerCase() === `grupo ${currentGroup}`;
    return isCurrentGroup && p.nombre.toLowerCase().includes(state.searchTerm.toLowerCase());
  });

  const activos = groupData.filter(p => p.participo).length;
  const auxiliares = groupData.filter(p => p.precursorado.toLowerCase().includes('auxiliar')).length;
  const regulares = groupData.filter(p => p.precursorado.toLowerCase() === 'regular').length;

  return `
    <!-- Compact Período & Resumen Bar -->
    <div class="px-4 sm:px-10 pt-4 pb-3 flex-shrink-0">
      <div class="bg-white border border-slate-200 rounded-2xl p-3 shadow-2xs flex flex-col md:flex-row md:items-center justify-between gap-3">
        <!-- Period Selector -->
        <div class="flex items-center gap-2.5">
          <label for="period-select" class="text-xs font-bold text-slate-500 uppercase tracking-wider">Período:</label>
          <select id="period-select" class="bg-slate-50 border border-slate-200 text-xs font-bold text-slate-800 rounded-xl px-3 py-1.5 focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 outline-none cursor-pointer transition-all">
            ${PERIODS.map(p => `
              <option value="${p.value}" ${state.selectedPeriod === p.value ? 'selected' : ''}>${p.value}</option>
            `).join('')}
          </select>
        </div>

        <!-- Compact Summary Stats -->
        <div class="grid grid-cols-2 sm:grid-cols-4 gap-2 md:gap-3 text-xs border-t md:border-t-0 border-slate-100 pt-2 md:pt-0">
          <div class="bg-slate-50 border border-slate-200/60 rounded-xl px-3 py-1.5 flex items-center justify-between gap-2">
            <span class="text-slate-500 font-bold text-[10px] uppercase tracking-wider">Publicadores</span>
            <span class="font-extrabold text-slate-900 text-sm">${groupData.length}</span>
          </div>
          <div class="bg-emerald-50/50 border border-emerald-200/60 rounded-xl px-3 py-1.5 flex items-center justify-between gap-2">
            <span class="text-emerald-700 font-bold text-[10px] uppercase tracking-wider">Activos</span>
            <span class="font-extrabold text-emerald-700 text-sm">${activos}</span>
          </div>
          <div class="bg-indigo-50/50 border border-indigo-200/60 rounded-xl px-3 py-1.5 flex items-center justify-between gap-2">
            <span class="text-indigo-700 font-bold text-[10px] uppercase tracking-wider">Auxiliares</span>
            <span class="font-extrabold text-indigo-700 text-sm">${auxiliares}</span>
          </div>
          <div class="bg-amber-50/50 border border-amber-200/60 rounded-xl px-3 py-1.5 flex items-center justify-between gap-2">
            <span class="text-amber-700 font-bold text-[10px] uppercase tracking-wider">Regulares</span>
            <span class="font-extrabold text-amber-700 text-sm">${regulares}</span>
          </div>
        </div>
      </div>
    </div>

    <main class="px-4 sm:px-10 flex-grow flex flex-col min-h-0 pb-8">
      <div class="mb-4 flex items-center justify-between gap-4">
        <div class="relative w-full sm:w-80">
          <i data-lucide="search" class="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400"></i>
          <input 
            type="text" 
            id="search-input"
            placeholder="Buscar publicador..."
            class="bg-white border border-slate-200 rounded-xl py-2 pl-9 pr-10 w-full focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all text-xs font-medium text-slate-700 shadow-sm"
            value="${state.searchTerm}"
          />
          ${state.searchTerm ? `
            <button id="clear-search" class="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 transition-colors cursor-pointer">
              <i data-lucide="x" class="w-4 h-4"></i>
            </button>
          ` : ''}
        </div>
      </div>

      <div class="bg-white border border-slate-200 rounded-2xl overflow-hidden flex flex-col h-full shadow-sm">
        <!-- Desktop Header -->
        <div class="hidden md:grid grid-cols-12 bg-slate-50 border-b border-slate-200 text-[11px] font-bold uppercase tracking-wider text-slate-500 py-4">
          <div class="col-span-3 px-8">Publicador</div>
          <div class="col-span-1 text-center">Participó</div>
          <div class="col-span-2 text-center">Cursos Bíblicos</div>
          <div class="col-span-2 text-center">Precursorado</div>
          <div class="col-span-2 text-center">Horas</div>
          <div class="col-span-2 px-4">Notas</div>
        </div>

        <div class="flex-grow overflow-y-auto">
          ${groupData.map((pub, idx) => `
            <!-- Desktop Row -->
            <div data-pub-id="${pub.id}" class="hidden md:grid grid-cols-12 border-b border-slate-100 hover:bg-indigo-50/20 transition-colors items-center min-h-[3.5rem] ${idx % 2 === 1 ? 'bg-slate-50/30' : ''}">
              <div class="col-span-3 px-8 font-semibold text-sm">
                <button 
                  data-pub-row="${pub.rowIndex}" 
                  data-pub-name="${pub.nombre}" 
                  class="open-card-btn text-left font-semibold text-slate-800 hover:text-indigo-600 hover:underline cursor-pointer focus:outline-none transition-colors"
                >
                  ${pub.nombre}
                </button>
              </div>
              
              <div class="col-span-1 flex justify-center">
                <input 
                  type="checkbox" 
                  class="participo-check w-5 h-5 rounded border-slate-300 text-indigo-600 focus:ring-indigo-500 cursor-pointer disabled:opacity-30"
                  ${pub.participo ? 'checked' : ''}
                  ${(state.saving === `${pub.id}-participo` || !isPeriodEditable) ? 'disabled' : ''}
                />
              </div>

              <div class="col-span-2 flex justify-center">
                <input 
                  type="number" 
                  class="cursos-input w-full text-center bg-transparent border border-transparent hover:border-slate-200 focus:border-indigo-400 focus:ring-0 rounded-lg py-1 text-sm outline-none transition-all ${pub.cursos === 0 ? 'opacity-30' : ''}"
                  value="${pub.cursos}"
                  min="0"
                  ${(state.saving === `${pub.id}-cursos` || !isPeriodEditable) ? 'disabled' : ''}
                />
              </div>

              <div class="col-span-2 flex justify-center px-4">
                <select 
                  class="precursorado-select bg-slate-100 text-[10px] font-bold border-none rounded-lg px-3 py-1.5 appearance-none uppercase cursor-pointer text-slate-600 focus:ring-2 focus:ring-indigo-500/20 transition-all w-full disabled:opacity-50"
                  ${(state.saving === `${pub.id}-precursorado` || !isPeriodEditable) ? 'disabled' : ''}
                >
                  <option value="" ${pub.precursorado === '' ? 'selected' : ''}></option>
                  <option value="Auxiliar 15 hs" ${pub.precursorado === 'Auxiliar 15 hs' ? 'selected' : ''}>Auxiliar 15 hs</option>
                  <option value="Auxiliar 30 hs" ${pub.precursorado === 'Auxiliar 30 hs' ? 'selected' : ''}>Auxiliar 30 hs</option>
                  <option value="Regular" ${pub.precursorado === 'Regular' ? 'selected' : ''}>Regular</option>
                </select>
              </div>

              <div class="col-span-2 flex justify-center">
                ${['auxiliar 15 hs', 'auxiliar 30 hs', 'regular'].includes(pub.precursorado.toLowerCase()) ? (() => {
                  return `
                    <input 
                      type="number" 
                      class="horas-input w-20 text-center bg-transparent border border-slate-200 focus:border-indigo-400 focus:ring-0 rounded-lg py-1 text-sm font-bold outline-none transition-all
                      ${pub.precursorado.toLowerCase() === 'regular' ? (pub.horas < 50 ? 'text-amber-600 border-amber-200 bg-amber-50/50' : 'text-emerald-600 border-emerald-200 bg-emerald-50/50') : ''}
                      ${pub.precursorado.toLowerCase() === 'auxiliar 15 hs' ? (pub.horas < 15 ? 'text-amber-600 border-amber-200 bg-amber-50/50' : 'text-emerald-600 border-emerald-200 bg-emerald-50/50') : ''}
                      ${pub.precursorado.toLowerCase() === 'auxiliar 30 hs' ? (pub.horas < 30 ? 'text-amber-600 border-amber-200 bg-amber-50/50' : 'text-emerald-600 border-emerald-200 bg-emerald-50/50') : ''}
                      disabled:opacity-30 disabled:cursor-not-allowed"
                      value="${pub.horas}"
                      min="0"
                      ${(state.saving === `${pub.id}-horas` || !isPeriodEditable) ? 'disabled' : ''}
                    />
                  `;
                })() : ''}
              </div>

              <div class="col-span-2 px-4">
                <input 
                  type="text" 
                  class="notas-input w-full bg-transparent border-none text-xs text-slate-500 placeholder-slate-300 focus:ring-0 focus:text-slate-900 transition-all italic hover:bg-slate-50 rounded px-2 py-1"
                  value="${pub.notas}"
                  placeholder="Añadir nota..."
                  ${(state.saving === `${pub.id}-notas` || !isPeriodEditable) ? 'disabled' : ''}
                />
              </div>
            </div>

            <!-- Mobile Card -->
            <div data-pub-id="${pub.id}" class="md:hidden p-4 border-b border-slate-100 space-y-4">
              <div class="flex justify-between items-center">
                <button 
                  data-pub-row="${pub.rowIndex}" 
                  data-pub-name="${pub.nombre}" 
                  class="open-card-btn text-left font-bold text-slate-800 hover:text-indigo-600 hover:underline text-base cursor-pointer focus:outline-none transition-colors"
                >
                  ${pub.nombre}
                </button>
                <div class="flex items-center gap-2">
                  <span class="text-xs text-slate-400 font-medium">Participó:</span>
                  <input 
                    type="checkbox" 
                    class="participo-check w-6 h-6 rounded border-slate-300 text-indigo-600 focus:ring-indigo-500 cursor-pointer disabled:opacity-30"
                    ${pub.participo ? 'checked' : ''}
                    ${(state.saving === `${pub.id}-participo` || !isPeriodEditable) ? 'disabled' : ''}
                  />
                </div>
              </div>

              <div class="grid grid-cols-2 gap-3">
                <div class="relative">
                  <label class="absolute -top-2 left-3 bg-white px-1 text-[9px] font-bold text-slate-400 uppercase tracking-wider">Cursos</label>
                  <input 
                    type="number" 
                    class="cursos-input w-full bg-white border border-slate-200 rounded-xl h-11 px-3 text-sm font-bold text-center disabled:opacity-50"
                    value="${pub.cursos}"
                    min="0"
                    ${(state.saving === `${pub.id}-cursos` || !isPeriodEditable) ? 'disabled' : ''}
                  />
                </div>
                <div class="relative">
                  <label class="absolute -top-2 left-3 bg-white px-1 text-[9px] font-bold text-slate-400 uppercase tracking-wider">Precursorado</label>
                  <select 
                    class="precursorado-select w-full bg-white border border-slate-200 rounded-xl h-11 px-3 text-xs font-bold text-slate-600 focus:ring-2 focus:ring-indigo-500/20 appearance-none disabled:opacity-50"
                    ${(state.saving === `${pub.id}-precursorado` || !isPeriodEditable) ? 'disabled' : ''}
                  >
                    <option value="" ${pub.precursorado === '' ? 'selected' : ''}>Ninguno</option>
                    <option value="Auxiliar 15 hs" ${pub.precursorado === 'Auxiliar 15 hs' ? 'selected' : ''}>Auxiliar 15 hs</option>
                    <option value="Auxiliar 30 hs" ${pub.precursorado === 'Auxiliar 30 hs' ? 'selected' : ''}>Auxiliar 30 hs</option>
                    <option value="Regular" ${pub.precursorado === 'Regular' ? 'selected' : ''}>Regular</option>
                  </select>
                </div>
              </div>

              ${['auxiliar 15 hs', 'auxiliar 30 hs', 'regular'].includes(pub.precursorado.toLowerCase()) ? (() => {
                return `
                  <div class="relative">
                    <label class="absolute -top-2 left-3 bg-white px-1 text-[9px] font-bold text-slate-400 uppercase tracking-wider">Horas</label>
                    <input 
                      type="number" 
                      class="horas-input w-full bg-white border border-slate-200 rounded-xl h-11 px-3 text-sm font-bold text-center
                      ${pub.precursorado.toLowerCase() === 'regular' ? (pub.horas < 50 ? 'text-amber-600 border-amber-200 bg-amber-50/50' : 'text-emerald-600 border-emerald-200 bg-emerald-50/50') : ''}
                      ${pub.precursorado.toLowerCase() === 'auxiliar 15 hs' ? (pub.horas < 15 ? 'text-amber-600 border-amber-200 bg-amber-50/50' : 'text-emerald-600 border-emerald-200 bg-emerald-50/50') : ''}
                      ${pub.precursorado.toLowerCase() === 'auxiliar 30 hs' ? (pub.horas < 30 ? 'text-amber-600 border-amber-200 bg-amber-50/50' : 'text-emerald-600 border-emerald-200 bg-emerald-50/50') : ''}
                      disabled:opacity-30"
                      value="${pub.horas}"
                      min="0"
                      ${(state.saving === `${pub.id}-horas` || !isPeriodEditable) ? 'disabled' : ''}
                    />
                  </div>
                `;
              })() : ''}

              <div class="relative">
                <label class="absolute -top-2 left-3 bg-white px-1 text-[9px] font-bold text-slate-400 uppercase tracking-wider">Notas</label>
                <textarea 
                  class="notas-input w-full bg-white border border-slate-200 rounded-xl p-3 pt-4 text-xs text-slate-600 italic focus:ring-2 focus:ring-indigo-500/20 disabled:opacity-50"
                  rows="2"
                  placeholder="..."
                  ${(state.saving === `${pub.id}-notas` || !isPeriodEditable) ? 'disabled' : ''}
                >${pub.notas}</textarea>
              </div>
            </div>
          `).join('')}
        </div>

        <div class="p-4 bg-slate-50 border-t border-slate-200 flex flex-col sm:flex-row justify-between items-center text-[11px] text-slate-500 font-medium gap-2">
          <span>Mostrando ${groupData.length} publicadores</span>
          <div class="flex items-center gap-4">
            ${state.saving ? `
              <span class="flex items-center gap-1"><i data-lucide="loader-2" class="w-3 h-3 animate-spin"></i> Guardando...</span>
            ` : ''}
            <div class="flex items-center gap-2">
              ${isPeriodEditable ? `
                <span class="w-2 h-2 rounded-full bg-green-500"></span>
                <span>Los cambios se guardan automáticamente</span>
              ` : `
                <span class="w-2 h-2 rounded-full bg-amber-500"></span>
                <span>Mes histórico: sólo lectura</span>
              `}
            </div>
          </div>
        </div>
      </div>
    </main>
  `;
}

function CardsView() {
  const full = state.fullPublishers || [];
  const selectedYear = state.cardsServiceYear || 2026;
  const currentTab = state.cardsSelectedGroup;
  const searchTerm = (state.cardsSearchTerm || '').toLowerCase().trim();

  // Filter full publishers for dropdown and selection
  const filtered = full.filter(p => {
    // Group / Tab filter
    if (currentTab !== 'all') {
      if (typeof currentTab === 'number') {
        if (p.grupo !== currentTab) return false;
      } else if (currentTab === 'men') {
        if (p.gender !== 'H') return false;
      } else if (currentTab === 'pioneers') {
        if (!isPioneerInServiceYear(p, selectedYear)) return false;
      }
    }

    // Search term
    if (searchTerm !== '') {
      const nameMatch = p.nombre.toLowerCase().includes(searchTerm);
      const familyMatch = p.family && p.family.toLowerCase().includes(searchTerm);
      const phoneMatch = p.whatsapp && p.whatsapp.includes(searchTerm);
      if (!nameMatch && !familyMatch && !phoneMatch) return false;
    }

    return true;
  });

  let selectedPub = full.find(p => p.id === state.cardsSelectedPubId);
  if (!selectedPub || !filtered.some(p => p.id === selectedPub.id)) {
    if (filtered.length > 0) {
      selectedPub = filtered[0];
    }
  }

  // Tabs definitions
  const tabs = [
    { id: 'all', label: 'Todos' },
    { id: 1, label: 'Grupo 1' },
    { id: 2, label: 'Grupo 2' },
    { id: 3, label: 'Grupo 3' },
    { id: 4, label: 'Grupo 4' },
    { id: 5, label: 'Grupo 5' },
    { id: 6, label: 'Grupo 6' },
    { id: 7, label: 'Grupo 7' },
    { id: 'men', label: 'Varones' },
    { id: 'pioneers', label: 'Precursores' },
  ];

  const yearMonths = MONTH_CONFIGS.filter(m => m.serviceYear === selectedYear);

  return `
    <div class="px-4 sm:px-10 py-6 flex-grow flex flex-col min-h-0 pb-12">
      <!-- Top Controls & Selector Bar (Hidden on Print) -->
      <div class="bg-white rounded-2xl border border-slate-200 shadow-xs p-4 mb-6 space-y-4 print:hidden">
        
        <!-- Filter Tabs / Dropdown for Mobile -->
        <div class="space-y-1">
          <label class="block text-[10px] font-bold text-slate-400 uppercase tracking-widest">
            Filtrar por Grupo o Categoría
          </label>

          <!-- Mobile Dropdown Select -->
          <div class="sm:hidden">
            <select 
              id="cards-tab-select" 
              class="cards-tab-select w-full bg-slate-50 border border-slate-200 text-xs font-bold text-slate-800 rounded-xl px-3 py-2 focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 outline-none cursor-pointer"
            >
              ${tabs.map(t => {
                let count = 0;
                if (t.id === 'all') count = full.length;
                else if (typeof t.id === 'number') count = full.filter(p => p.grupo === t.id).length;
                else if (t.id === 'men') count = full.filter(p => p.gender === 'H').length;
                else if (t.id === 'pioneers') count = full.filter(p => isPioneerInServiceYear(p, selectedYear)).length;

                const isSel = currentTab === t.id;
                return `<option value="${t.id}" ${isSel ? 'selected' : ''}>${t.label} (${count})</option>`;
              }).join('')}
            </select>
          </div>

          <!-- Desktop Pills -->
          <div class="hidden sm:flex flex-wrap gap-1.5 items-center overflow-x-auto pb-1">
            ${tabs.map(t => {
              let count = 0;
              if (t.id === 'all') count = full.length;
              else if (typeof t.id === 'number') count = full.filter(p => p.grupo === t.id).length;
              else if (t.id === 'men') count = full.filter(p => p.gender === 'H').length;
              else if (t.id === 'pioneers') count = full.filter(p => isPioneerInServiceYear(p, selectedYear)).length;

              const isActive = currentTab === t.id;
              return `
                <button 
                  data-card-tab="${t.id}"
                  class="cards-tab-btn px-3 py-1.5 text-xs rounded-lg transition-all flex items-center gap-1.5 whitespace-nowrap cursor-pointer ${isActive ? 'bg-indigo-600 text-white font-bold shadow-xs' : 'bg-slate-50 hover:bg-slate-100 text-slate-700 font-medium border border-slate-200'}"
                >
                  <span>${t.label}</span>
                  <span class="text-[10px] px-1.5 py-0.2 rounded-full font-bold ${isActive ? 'bg-indigo-800 text-indigo-100' : 'bg-slate-200 text-slate-600'}">
                    ${count}
                  </span>
                </button>
              `;
            }).join('')}
          </div>
        </div>

        <!-- Service Year Selection -->
        <div class="space-y-1 pt-2 border-t border-slate-200">
          <label class="block text-[10px] font-bold text-slate-400 uppercase tracking-widest">
            Año de Servicio
          </label>
          <div class="flex gap-2 items-center max-w-xs">
            <button
              id="sy2026-btn"
              class="flex-1 py-1.5 px-3 text-xs rounded-xl transition-all text-center font-bold cursor-pointer ${selectedYear === 2026 ? 'bg-indigo-600 text-white shadow-xs' : 'bg-slate-50 border border-slate-200 text-slate-700 hover:bg-slate-100'}"
            >
              Año 2026
            </button>
            <button
              id="sy2025-btn"
              class="flex-1 py-1.5 px-3 text-xs rounded-xl transition-all text-center font-bold cursor-pointer ${selectedYear === 2025 ? 'bg-indigo-600 text-white shadow-xs' : 'bg-slate-50 border border-slate-200 text-slate-700 hover:bg-slate-100'}"
            >
              Año 2025
            </button>
          </div>
        </div>

        <!-- Search Bar & Dropdown Selector -->
        <div class="grid grid-cols-1 md:grid-cols-12 gap-3 pt-2 border-t border-slate-200 items-center">
          
          <!-- Search input -->
          <div class="md:col-span-5 relative">
            <input
              type="text"
              id="cards-search-input"
              placeholder="Buscar por nombre, whatsapp..."
              class="w-full pl-8 pr-8 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 font-medium"
              value="${state.cardsSearchTerm}"
            />
            <i data-lucide="search" class="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-2.5"></i>
            ${state.cardsSearchTerm ? `
              <button id="cards-clear-search" class="absolute right-2.5 top-2 text-slate-400 hover:text-slate-600 text-xs font-bold cursor-pointer">✕</button>
            ` : ''}
          </div>

          <!-- Dropdown Select & Prev/Next Buttons -->
          <div class="md:col-span-7 flex items-center gap-1.5">
            <button
              id="cards-prev-pub-btn"
              class="p-2 border border-slate-200 rounded-xl bg-white hover:bg-slate-50 disabled:opacity-40 disabled:cursor-not-allowed transition-colors cursor-pointer"
              title="Publicador Anterior"
              ${!selectedPub || filtered.findIndex(p => p.id === selectedPub.id) <= 0 ? 'disabled' : ''}
            >
              <i data-lucide="chevron-left" class="w-4 h-4"></i>
            </button>

            <select
              id="cards-publisher-select"
              class="w-full py-2 px-3 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold text-slate-900 focus:outline-none focus:border-indigo-500 cursor-pointer"
            >
              ${filtered.length === 0 ? '<option value="">Sin resultados</option>' : filtered.map(p => {
                const isSel = selectedPub && p.id === selectedPub.id;
                const appt = p.appointment ? ` [${p.appointment}]` : '';
                const prec = isPioneerInServiceYear(p, selectedYear) ? ' ⭐' : '';
                return `<option value="${p.id}" ${isSel ? 'selected' : ''}>${p.nombre} (Grupo ${p.grupo})${appt}${prec}</option>`;
              }).join('')}
            </select>

            <button
              id="cards-next-pub-btn"
              class="p-2 border border-slate-200 rounded-xl bg-white hover:bg-slate-50 disabled:opacity-40 disabled:cursor-not-allowed transition-colors cursor-pointer"
              title="Siguiente Publicador"
              ${!selectedPub || filtered.findIndex(p => p.id === selectedPub.id) >= filtered.length - 1 ? 'disabled' : ''}
            >
              <i data-lucide="chevron-right" class="w-4 h-4"></i>
            </button>
          </div>

        </div>

      </div>

      <!-- S-21-S CARD CONTAINER -->
      ${!selectedPub ? `
        <div class="bg-white p-12 text-center rounded-2xl border border-slate-200 shadow-xs max-w-xl mx-auto my-6">
          <div class="text-slate-400 font-bold text-lg mb-2">No se encontró ningún publicador</div>
          <p class="text-slate-500 text-xs">Prueba borrando la búsqueda o cambiando de grupo.</p>
        </div>
      ` : (() => {
        let appointmentLabel = 'Publicador';
        if (selectedPub.appointment === 'A') appointmentLabel = 'Anciano';
        else if (selectedPub.appointment === 'SM') appointmentLabel = 'Siervo Ministerial';

        const isRegPioneer = isPioneerInServiceYear(selectedPub, selectedYear);

        let totalHours = 0;
        let totalStudies = 0;
        let monthsParticipated = 0;
        let activeMonthsCount = 0;

        yearMonths.forEach(m => {
          const act = selectedPub.monthlyData[m.key];
          if (act) {
            const hasData = act.participated || act.hours !== null || act.bibleStudies !== null || (act.notes && act.notes.trim() !== '');
            if (hasData) activeMonthsCount++;
            if (act.participated) monthsParticipated++;
            if (act.hours !== null) totalHours += act.hours;
            if (act.bibleStudies !== null) totalStudies += act.bibleStudies;
          }
        });

        const divisor = activeMonthsCount > 0 ? activeMonthsCount : 12;
        const avgHours = (totalHours / divisor).toFixed(1);

        return `
          <div class="bg-white rounded-2xl border border-slate-200 shadow-md p-6 max-w-4xl mx-auto print:border-none print:shadow-none print:p-0 print:m-0 print:max-w-none text-slate-900">
            
            <!-- Form Official Header -->
            <div class="border-b-2 border-slate-900 pb-3 mb-4">
              <div class="flex flex-col md:flex-row justify-between items-start md:items-center gap-1 md:gap-0">
                <h1 class="font-extrabold text-base md:text-lg tracking-tight uppercase text-slate-900">
                  <span class="md:hidden">REGISTRO DE PUBLICADOR</span>
                  <span class="hidden md:inline">REGISTRO DE PUBLICADOR DE LA CONGREGACIÓN</span>
                </h1>
                <span class="text-xs font-mono font-bold bg-slate-100 border border-slate-300 px-2 py-0.5 rounded-sm text-slate-700">
                  S-21-S
                </span>
              </div>
            </div>

            <!-- Personal Info Grid -->
            <div class="grid grid-cols-1 md:grid-cols-4 gap-3 bg-slate-50 p-4 rounded-xl border border-slate-200 mb-5 text-xs">
              <div>
                <span class="block text-[9px] font-bold text-slate-400 uppercase tracking-widest mb-0.5">Nombre</span>
                <span class="font-bold text-slate-900 block text-xs md:text-sm truncate">${selectedPub.nombre}</span>
              </div>

              <div>
                <span class="block text-[9px] font-bold text-slate-400 uppercase tracking-widest mb-0.5">Grupo de Servicio</span>
                <span class="font-semibold text-slate-800 block text-xs">
                  Grupo ${selectedPub.grupo}
                </span>
              </div>

              <div>
                <span class="block text-[9px] font-bold text-slate-400 uppercase tracking-widest mb-0.5">Fecha de Nacimiento</span>
                <span class="font-mono text-slate-800 block text-xs">${formatDateForCard(selectedPub.birthDate)}</span>
              </div>

              <div>
                <span class="block text-[9px] font-bold text-slate-400 uppercase tracking-widest mb-0.5">Fecha de Bautismo</span>
                <span class="font-mono text-slate-800 block text-xs">${formatDateForCard(selectedPub.baptismDate)}</span>
              </div>

              <div>
                <span class="block text-[9px] font-bold text-slate-400 uppercase tracking-widest mb-0.5">Género / Esperanza</span>
                <span class="font-semibold text-slate-800 block text-xs">
                  ${selectedPub.gender === 'H' ? 'Hombre' : 'Mujer'} • ${selectedPub.hope || 'Otras ovejas'}
                </span>
              </div>

              <div>
                <span class="block text-[9px] font-bold text-slate-400 uppercase tracking-widest mb-0.5">Nombramiento</span>
                <span class="font-bold text-slate-900 block text-xs">
                  ${appointmentLabel}
                </span>
              </div>

              <div>
                <span class="block text-[9px] font-bold text-slate-400 uppercase tracking-widest mb-0.5">Precursorado</span>
                <span class="block text-xs">
                  ${isRegPioneer ? '<span class="font-bold text-amber-700">Precursor Regular</span>' : '<span class="text-slate-400 font-normal">—</span>'}
                </span>
              </div>

              <div>
                <span class="block text-[9px] font-bold text-slate-400 uppercase tracking-widest mb-0.5">Teléfono / WhatsApp</span>
                <span class="font-mono text-slate-800 block text-xs truncate">${selectedPub.whatsapp || '—'}</span>
              </div>
            </div>

            <!-- Service Year Table -->
            <div class="overflow-x-auto border border-slate-300 rounded-xl mb-4">
              <table class="w-full text-left text-xs border-collapse">
                <thead>
                  <tr class="bg-slate-900 text-white text-[10px] uppercase font-bold tracking-wider">
                    <th class="py-2.5 px-3 border-r border-slate-700">Mes</th>
                    <th class="py-2.5 px-1.5 md:px-2 text-center border-r border-slate-700">
                      <span class="hidden md:inline">Participó</span>
                      <span class="md:hidden">Part.</span>
                    </th>
                    <th class="py-2.5 px-1.5 md:px-2 text-center border-r border-slate-700">
                      <span class="hidden md:inline">Cursos Bíblicos</span>
                      <span class="md:hidden">Cursos</span>
                    </th>
                    <th class="py-2.5 px-1.5 md:px-3 text-center border-r border-slate-700">
                      <span class="hidden md:inline">Precursorado</span>
                      <span class="md:hidden">Prec.</span>
                    </th>
                    <th class="py-2.5 px-2 md:px-3 text-center border-r border-slate-700">Horas</th>
                    <th class="py-2.5 px-2 md:px-3 text-left hidden md:table-cell">Notas</th>
                  </tr>
                </thead>
                <tbody class="divide-y divide-slate-200">
                  ${yearMonths.map(m => {
                    const act = selectedPub.monthlyData[m.key] || {};
                    const hasNotes = act.notes && act.notes.trim() !== '';

                    let precFull = '—';
                    let precShort = '—';
                    let isPrec = false;

                    if (act.pioneerType || act.isAuxiliaryPioneer) {
                      isPrec = true;
                      const pStr = (act.pioneerType || '').toLowerCase().trim();
                      if (pStr.includes('regular') || pStr === 'reg') {
                        precFull = 'Precursor Regular';
                        precShort = 'Reg';
                      } else if (pStr.includes('30')) {
                        precFull = 'Auxiliar 30 hs';
                        precShort = 'Aux 30';
                      } else if (pStr.includes('15') || pStr.includes('auxiliar') || act.isAuxiliaryPioneer) {
                        precFull = 'Auxiliar 15 hs';
                        precShort = 'Aux 15';
                      } else {
                        precFull = act.pioneerType || 'Auxiliar';
                        precShort = act.pioneerType || 'Aux';
                      }
                    }
                    
                    return `
                      <tr class="hover:bg-slate-50 transition-colors">
                        <td class="py-2.5 px-3 font-bold text-slate-900 border-r border-slate-200">
                          <span class="hidden md:inline print:inline">${m.label || act.monthLabel || ''} ${m.year || act.year || ''}</span>
                          <span class="md:hidden print:hidden">${m.shortLabel || m.prefix || act.shortLabel || m.label || ''}</span>
                        </td>

                        <td class="py-2.5 px-1.5 md:px-2 text-center border-r border-slate-200">
                          ${act.participated
                            ? '<span class="text-emerald-700 font-extrabold text-sm">✓</span>'
                            : '<span class="text-slate-400 font-normal">—</span>'}
                        </td>

                        <td class="py-2.5 px-1.5 md:px-2 text-center border-r border-slate-200">
                          ${act.bibleStudies !== null && act.bibleStudies !== undefined && act.bibleStudies !== ''
                            ? `<span class="font-mono font-bold text-slate-900">${act.bibleStudies}</span>`
                            : '<span class="text-slate-400 font-normal">—</span>'}
                        </td>

                        <td class="py-2.5 px-1 md:px-3 text-center border-r border-slate-200 text-xs">
                          ${isPrec
                            ? `<span class="px-1.5 md:px-2 py-0.5 rounded-md text-[10px] font-bold bg-slate-800 text-white inline-block">
                                <span class="hidden md:inline">${precFull}</span>
                                <span class="md:hidden">${precShort}</span>
                              </span>`
                            : '<span class="text-slate-400 font-normal">—</span>'}
                        </td>

                        <td class="py-2.5 px-1.5 md:px-3 text-center border-r border-slate-200 bg-slate-50/50">
                          <div class="inline-flex items-center justify-center gap-1">
                            ${act.hours !== null && act.hours !== undefined && act.hours !== ''
                              ? `<span class="font-mono font-bold text-slate-900">${act.hours}</span>`
                              : '<span class="text-slate-400 font-normal">—</span>'}
                            ${hasNotes ? `
                              <button 
                                type="button" 
                                class="md:hidden note-arrow-btn inline-flex items-center justify-center w-5 h-5 rounded-full bg-indigo-100 text-indigo-700 hover:bg-indigo-200 cursor-pointer transition-colors shrink-0"
                                data-note="${(act.notes || '').replace(/"/g, '&quot;')}"
                                title="Ver nota: ${(act.notes || '').replace(/"/g, '&quot;')}"
                              >
                                <i data-lucide="arrow-right" class="w-3 h-3"></i>
                              </button>
                            ` : ''}
                          </div>
                        </td>

                        <td class="py-2.5 px-2 md:px-3 text-[11px] truncate max-w-xs text-left hidden md:table-cell">
                          ${hasNotes
                            ? `<span class="text-slate-600">${act.notes}</span>`
                            : '<span class="text-slate-400 font-normal">—</span>'}
                        </td>
                      </tr>
                    `;
                  }).join('')}
                </tbody>

                <tfoot class="hidden md:table-footer-group">
                  <tr class="bg-slate-100 border-t-2 border-slate-900 text-slate-900 font-bold text-xs">
                    <td class="py-2.5 px-3 border-r border-slate-300">TOTALES (${activeMonthsCount > 0 ? activeMonthsCount : 12} MESES)</td>
                    
                    <td class="py-2.5 px-2 text-center border-r border-slate-300 font-mono">
                      ${monthsParticipated} / ${activeMonthsCount > 0 ? activeMonthsCount : 12}
                    </td>

                    <td class="py-2.5 px-2 text-center border-r border-slate-300 font-mono">
                      ${totalStudies > 0 ? totalStudies : '<span class="text-slate-400 font-normal">—</span>'}
                    </td>

                    <td class="py-2.5 px-3 text-center border-r border-slate-300 text-[11px]">
                      <span class="text-slate-400 font-normal">—</span>
                    </td>

                    <td class="py-2.5 px-3 text-center font-mono font-black text-sm border-r border-slate-300 bg-slate-200">
                      ${totalHours} h
                    </td>

                    <td class="py-2.5 px-3 text-slate-700 font-medium text-xs">
                      Promedio: <span class="font-bold font-mono text-slate-900">${avgHours} h/mes</span>
                    </td>
                  </tr>
                </tfoot>
              </table>
            </div>

            <!-- Mobile Totales Section (un valor por fila) -->
            <div class="md:hidden bg-slate-50 border border-slate-200 rounded-xl p-4 space-y-2 text-xs text-slate-800">
              <div class="font-extrabold text-slate-900 text-xs uppercase tracking-wider mb-2 border-b border-slate-200 pb-2 flex items-center justify-between">
                <span>Totales</span>
                <span class="text-[10px] text-slate-500 font-mono font-normal">Año ${selectedYear}</span>
              </div>
              <div class="flex items-center justify-between py-1 border-b border-slate-200/60">
                <span class="text-slate-600 font-medium">Meses totales</span>
                <span class="font-mono font-bold text-slate-900">${activeMonthsCount > 0 ? activeMonthsCount : 12}</span>
              </div>
              <div class="flex items-center justify-between py-1 border-b border-slate-200/60">
                <span class="text-slate-600 font-medium">Meses que participó</span>
                <span class="font-mono font-bold text-slate-900">${monthsParticipated}</span>
              </div>
              <div class="flex items-center justify-between py-1 border-b border-slate-200/60">
                <span class="text-slate-600 font-medium">Horas totales</span>
                <span class="font-mono font-extrabold text-indigo-700 text-sm">${totalHours} h</span>
              </div>
              <div class="flex items-center justify-between py-1">
                <span class="text-slate-600 font-medium">Promedio de horas</span>
                <span class="font-mono font-bold text-slate-900">${avgHours} h/mes</span>
              </div>
            </div>

          </div>
        `;
      })()}
    </div>
  `;
}

function MainView() {
  return `
    ${MainHeader()}
    ${state.error ? `
      <div class="mx-10 mt-6 bg-red-50 border border-red-200 p-4 rounded-xl flex items-center justify-between">
        <p class="text-red-700 text-sm font-medium">${state.error}</p>
        <button id="reload-btn" class="text-red-700 p-1 hover:bg-red-100 rounded">
          <i data-lucide="refresh-ccw" class="w-4 h-4"></i>
        </button>
      </div>
    ` : ''}

    ${state.currentView === 'cards' ? CardsView() : TableView()}
  `;
}

function LoadingView() {
  return `
    ${MainHeader()}
    <main class="px-4 sm:px-10 py-8 flex-grow flex flex-col min-h-0">
      <div class="bg-white border border-slate-200 rounded-2xl p-12 text-center shadow-xs">
        <i data-lucide="loader-2" class="w-8 h-8 text-indigo-600 animate-spin mx-auto mb-4"></i>
        <p class="text-slate-600 font-semibold text-sm">Cargando datos desde Google Sheets...</p>
      </div>
    </main>
  `;
}

function render() {
  const $app = $('#app');
  let html = "";

  if (!state.accessToken) {
    html = LoginView();
  } else if (state.loading && state.data.length === 0) {
    html = LoadingView();
  } else {
    html = MainView();
  }

  $app.html(html);
  if (window.lucide) window.lucide.createIcons();
  
  $('#login-btn').on('click', login);
  $('.logout-btn, #logout-btn').on('click', logout);
  $('#reload-btn').on('click', loadData);

  // View Switcher
  $('#view-table-btn').on('click', () => {
    window.location.hash = 'table';
    setState({ currentView: 'table' });
  });

  $('#view-cards-btn').on('click', () => {
    window.location.hash = 'cards';
    setState({ currentView: 'cards' });
  });

  // Table view handlers
  $('#period-select').on('change', function() {
    const newVal = $(this).val();
    setState({ selectedPeriod: newVal });
    loadData();
  });
  
  $('#search-input').on('input', function() {
    state.searchTerm = $(this).val();
    render();
    const $input = $('#search-input');
    if ($input.length) {
      $input.focus();
      const val = $input.val();
      if ($input[0] && $input[0].setSelectionRange) {
        $input[0].setSelectionRange(val.length, val.length);
      }
    }
  });

  $('#clear-search').on('click', () => {
    state.searchTerm = "";
    render();
  });

  $('.participo-check').on('change', function() {
    const id = $(this).closest('[data-pub-id]').data('pub-id');
    const pub = state.data.find(p => p.id === id);
    handleUpdate(pub, 'participo', $(this).is(':checked'));
  });

  $('.cursos-input').on('change', function() {
    const id = $(this).closest('[data-pub-id]').data('pub-id');
    const pub = state.data.find(p => p.id === id);
    handleUpdate(pub, 'cursos', parseInt($(this).val()) || 0);
  });

  $('.precursorado-select').on('change', function() {
    const id = $(this).closest('[data-pub-id]').data('pub-id');
    const pub = state.data.find(p => p.id === id);
    handleUpdate(pub, 'precursorado', $(this).val());
  });

  $('.horas-input').on('change', async function() {
    const id = $(this).closest('[data-pub-id]').data('pub-id');
    const pub = state.data.find(p => p.id === id);
    const val = parseInt($(this).val()) || 0;
    
    if (val > 0 && !pub.participo) {
      await handleUpdate(pub, 'participo', true);
      const updatedPub = state.data.find(p => p.id === id);
      handleUpdate(updatedPub, 'horas', val);
    } else {
      handleUpdate(pub, 'horas', val);
    }
  });

  $('.notas-input').on('blur', function() {
    const id = $(this).closest('[data-pub-id]').data('pub-id');
    const pub = state.data.find(p => p.id === id);
    const newVal = $(this).val();
    if (newVal !== pub.notas) {
      handleUpdate(pub, 'notas', newVal);
    }
  });

  $('.open-card-btn').on('click', function(e) {
    e.preventDefault();
    const rowIndex = $(this).data('pub-row');
    const name = $(this).data('pub-name');
    
    const full = state.fullPublishers || [];
    const targetPub = full.find(p => p.rowIndex === rowIndex || p.nombre === name);
    
    if (targetPub) {
      window.location.hash = 'cards';
      const defaultGroup = typeof state.groupNumber === 'number' 
        ? state.groupNumber 
        : (parseInt(state.groupNumber, 10) || (targetPub.grupo ? parseInt(targetPub.grupo, 10) : 1));
      
      setState({
        currentView: 'cards',
        cardsSelectedPubId: targetPub.id,
        cardsSelectedGroup: defaultGroup,
        cardsSearchTerm: ''
      });
    }
  });

  // --- Tarjetas View Handlers ---
  $(document).on('click', '.note-arrow-btn', function(e) {
    e.preventDefault();
    e.stopPropagation();
    const note = $(this).attr('data-note');
    if (note) {
      alert(`Nota: ${note}`);
    }
  });

  $('.cards-tab-btn').on('click', function() {
    const tabAttr = $(this).data('card-tab');
    let groupVal = tabAttr;
    if (tabAttr !== 'all' && tabAttr !== 'men' && tabAttr !== 'pioneers') {
      groupVal = parseInt(tabAttr, 10);
    }
    setState({ cardsSelectedGroup: groupVal });
  });

  $('.cards-tab-select').on('change', function() {
    const tabAttr = $(this).val();
    let groupVal = tabAttr;
    if (tabAttr !== 'all' && tabAttr !== 'men' && tabAttr !== 'pioneers') {
      groupVal = parseInt(tabAttr, 10);
    }
    setState({ cardsSelectedGroup: groupVal });
  });

  $('#cards-search-input').on('input', function() {
    state.cardsSearchTerm = $(this).val();
    render();
    const $input = $('#cards-search-input');
    if ($input.length) {
      $input.focus();
      const val = $input.val();
      if ($input[0] && $input[0].setSelectionRange) {
        $input[0].setSelectionRange(val.length, val.length);
      }
    }
  });

  $('#cards-clear-search').on('click', () => {
    state.cardsSearchTerm = "";
    render();
  });

  $('#cards-publisher-select').on('change', function() {
    setState({ cardsSelectedPubId: $(this).val() });
  });

  $('#cards-prev-pub-btn').on('click', function() {
    const full = state.fullPublishers || [];
    const currentTab = state.cardsSelectedGroup;
    const searchTerm = (state.cardsSearchTerm || '').toLowerCase().trim();
    const selectedYear = state.cardsServiceYear || 2026;

    const filtered = full.filter(p => {
      if (currentTab !== 'all') {
        if (typeof currentTab === 'number' && p.grupo !== currentTab) return false;
        if (currentTab === 'men' && p.gender !== 'H') return false;
        if (currentTab === 'pioneers' && !isPioneerInServiceYear(p, selectedYear)) return false;
      }
      if (searchTerm !== '') {
        const nameMatch = p.nombre.toLowerCase().includes(searchTerm);
        const familyMatch = p.family && p.family.toLowerCase().includes(searchTerm);
        const phoneMatch = p.whatsapp && p.whatsapp.includes(searchTerm);
        if (!nameMatch && !familyMatch && !phoneMatch) return false;
      }
      return true;
    });

    const idx = filtered.findIndex(p => p.id === state.cardsSelectedPubId);
    if (idx > 0) {
      setState({ cardsSelectedPubId: filtered[idx - 1].id });
    }
  });

  $('#cards-next-pub-btn').on('click', function() {
    const full = state.fullPublishers || [];
    const currentTab = state.cardsSelectedGroup;
    const searchTerm = (state.cardsSearchTerm || '').toLowerCase().trim();
    const selectedYear = state.cardsServiceYear || 2026;

    const filtered = full.filter(p => {
      if (currentTab !== 'all') {
        if (typeof currentTab === 'number' && p.grupo !== currentTab) return false;
        if (currentTab === 'men' && p.gender !== 'H') return false;
        if (currentTab === 'pioneers' && !isPioneerInServiceYear(p, selectedYear)) return false;
      }
      if (searchTerm !== '') {
        const nameMatch = p.nombre.toLowerCase().includes(searchTerm);
        const familyMatch = p.family && p.family.toLowerCase().includes(searchTerm);
        const phoneMatch = p.whatsapp && p.whatsapp.includes(searchTerm);
        if (!nameMatch && !familyMatch && !phoneMatch) return false;
      }
      return true;
    });

    const idx = filtered.findIndex(p => p.id === state.cardsSelectedPubId);
    if (idx < filtered.length - 1) {
      setState({ cardsSelectedPubId: filtered[idx + 1].id });
    }
  });

  $('#sy2026-btn').on('click', () => {
    setState({ cardsServiceYear: 2026 });
  });

  $('#sy2025-btn').on('click', () => {
    setState({ cardsServiceYear: 2025 });
  });
}

$(() => {
  window.addEventListener('hashchange', () => {
    const newView = window.location.hash === '#cards' ? 'cards' : 'table';
    if (state.currentView !== newView) {
      setState({ currentView: newView });
    }
  });

  render();
  if (state.accessToken) {
    loadData();
  }
});
