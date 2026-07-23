// Configuration
const SPREADSHEET_ID = '1dYFIQCIcVmyEwN4u6_So5z36xMUS8Yo-M2tzqW0DcJs';
const SHEET_NAME = 'publicadores';
const SCOPES = 'https://www.googleapis.com/auth/spreadsheets https://www.googleapis.com/auth/userinfo.email';

// Spanish months generator helper for Spanish periods (of the last 6 months starting from last month)
function getPeriods() {
  const months = ['Ene', 'Feb', 'Mar', 'Abr', 'May', 'Jun', 'Jul', 'Ago', 'Sep', 'Oct', 'Nov', 'Dic'];
  const periods = [];
  const now = new Date();
  
  for (let i = 1; i <= 6; i++) {
    const d = new Date(now.getFullYear(), now.getMonth() - i, 1);
    const monthName = months[d.getMonth()];
    const yearNumber = d.getFullYear() % 100;
    const label = `${monthName} ${yearNumber}`;
    periods.push({
      value: label,
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
  { prefix: 'Set 24', altPrefix: 'Sep 24', label: 'Septiembre', year: 2024, serviceYear: 2025, index: 0, key: '2024-09' },
  { prefix: 'Oct 24', altPrefix: 'Oct 24', label: 'Octubre', year: 2024, serviceYear: 2025, index: 1, key: '2024-10' },
  { prefix: 'Nov 24', altPrefix: 'Nov 24', label: 'Noviembre', year: 2024, serviceYear: 2025, index: 2, key: '2024-11' },
  { prefix: 'Dic 24', altPrefix: 'Dic 24', label: 'Diciembre', year: 2024, serviceYear: 2025, index: 3, key: '2024-12' },
  { prefix: 'Ene 25', altPrefix: 'Ene 25', label: 'Enero', year: 2025, serviceYear: 2025, index: 4, key: '2025-01' },
  { prefix: 'Feb 25', altPrefix: 'Feb 25', label: 'Febrero', year: 2025, serviceYear: 2025, index: 5, key: '2025-02' },
  { prefix: 'Mar 25', altPrefix: 'Mar 25', label: 'Marzo', year: 2025, serviceYear: 2025, index: 6, key: '2025-03' },
  { prefix: 'Abr 25', altPrefix: 'Abr 25', label: 'Abril', year: 2025, serviceYear: 2025, index: 7, key: '2025-04' },
  { prefix: 'May 25', altPrefix: 'May 25', label: 'Mayo', year: 2025, serviceYear: 2025, index: 8, key: '2025-05' },
  { prefix: 'Jun 25', altPrefix: 'Jun 25', label: 'Junio', year: 2025, serviceYear: 2025, index: 9, key: '2025-06' },
  { prefix: 'Jul 25', altPrefix: 'Jul 25', label: 'Julio', year: 2025, serviceYear: 2025, index: 10, key: '2025-07' },
  { prefix: 'Ago 25', altPrefix: 'Ago 25', label: 'Agosto', year: 2025, serviceYear: 2025, index: 11, key: '2025-08' },

  { prefix: 'Sep 25', altPrefix: 'Set 25', label: 'Septiembre', year: 2025, serviceYear: 2026, index: 0, key: '2025-09' },
  { prefix: 'Oct 25', altPrefix: 'Oct 25', label: 'Octubre', year: 2025, serviceYear: 2026, index: 1, key: '2025-10' },
  { prefix: 'Nov 25', altPrefix: 'Nov 25', label: 'Noviembre', year: 2025, serviceYear: 2026, index: 2, key: '2025-11' },
  { prefix: 'Dic 25', altPrefix: 'Dic 25', label: 'Diciembre', year: 2025, serviceYear: 2026, index: 3, key: '2025-12' },
  { prefix: 'Ene 26', altPrefix: 'Ene 26', label: 'Enero', year: 2026, serviceYear: 2026, index: 4, key: '2026-01' },
  { prefix: 'Feb 26', altPrefix: 'Feb 26', label: 'Febrero', year: 2026, serviceYear: 2026, index: 5, key: '2026-02' },
  { prefix: 'Mar 26', altPrefix: 'Mar 26', label: 'Marzo', year: 2026, serviceYear: 2026, index: 6, key: '2026-03' },
  { prefix: 'Abr 26', altPrefix: 'Abr 26', label: 'Abril', year: 2026, serviceYear: 2026, index: 7, key: '2026-04' },
  { prefix: 'May 26', altPrefix: 'May 26', label: 'Mayo', year: 2026, serviceYear: 2026, index: 8, key: '2026-05' },
  { prefix: 'Jun 26', altPrefix: 'Jun 26', label: 'Junio', year: 2026, serviceYear: 2026, index: 9, key: '2026-06' },
  { prefix: 'Jul 26', altPrefix: 'Jul 26', label: 'Julio', year: 2026, serviceYear: 2026, index: 10, key: '2026-07' },
  { prefix: 'Ago 26', altPrefix: 'Ago 26', label: 'Agosto', year: 2026, serviceYear: 2026, index: 11, key: '2026-08' },
];

let state = {
  accessToken: localStorage.getItem('sheets_access_token'),
  userEmail: localStorage.getItem('user_email'),
  groupNumber: localStorage.getItem('group_number') || 1,
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
  cardsSelectedGroup: 'all',
  cardsSearchTerm: "",
  cardsSelectedPubId: "",
  cardsServiceYear: 2026,
  cardsEditingPub: null,
  cardsModalMonthKey: '2025-09',
};

// --- Google Sheets Service Logic ---
async function fetchWithAuth(url, options = {}) {
  const headers = {
    ...options.headers,
    Authorization: `Bearer ${state.accessToken}`,
    'Content-Type': 'application/json',
  };
  const response = await fetch(url, { ...options, headers });
  if (!response.ok) {
    const error = await response.json();
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
    const idxParticipo = findCol(`${state.selectedPeriod} participó`);
    const idxCursos = findCol(`${state.selectedPeriod} cursos`);
    const idxPrecursorado = findCol(`${state.selectedPeriod} precursorado`);
    const idxHoras = findCol(`${state.selectedPeriod} horas`);
    const idxNotas = findCol(`${state.selectedPeriod} notas`);

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
          hope: 'Otras ovejas',
          monthlyData,
          colIndices: {
            nombre: idxNombre,
            grupo: idxGrupo,
            whatsapp: idxWhatsApp,
            nacimiento: idxNacimiento,
            bautismo: idxBautismo,
            h_m: idxGender,
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
    if (friendlyMsg.includes('Sesión expirada')) {
      logout();
    }
    setState({ error: friendlyMsg, loading: false });
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
  setState({ accessToken: null, userEmail: null, groupNumber: 1, data: [], fullPublishers: [], headers: [] });
}

async function handleUpdate(pub, field, value) {
  const saveKey = `${pub.id}-${field}`;
  setState({ saving: saveKey });
  
  try {
    const findCol = (name) => state.headers.findIndex(h => h.trim().toLowerCase().includes(name.toLowerCase()));
    let colIdx = -1;
    if (field === 'participo') colIdx = findCol(`${state.selectedPeriod} participó`);
    else if (field === 'cursos') colIdx = findCol(`${state.selectedPeriod} cursos`);
    else if (field === 'precursorado') colIdx = findCol(`${state.selectedPeriod} precursorado`);
    else if (field === 'horas') colIdx = findCol(`${state.selectedPeriod} horas`);
    else if (field === 'notas') colIdx = findCol(`${state.selectedPeriod} notas`);

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
        <h1 class="text-2xl font-bold text-slate-900 mb-2">Shangrilá Informes</h1>
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
    <header class="h-20 bg-white border-b border-slate-200 px-4 sm:px-10 flex items-center justify-between flex-shrink-0 print:hidden">
      <div class="flex items-center gap-4">
        ${state.fetchingInfo ? `
          <div class="w-10 h-10 bg-slate-100 rounded flex items-center justify-center ring-4 ring-slate-50 animate-pulse">
            <div class="w-4 h-4 bg-slate-200 rounded"></div>
          </div>
        ` : `
          <div class="w-10 h-10 bg-indigo-600 rounded flex items-center justify-center text-white font-bold text-xl ring-4 ring-indigo-50">${currentGroup}</div>
        `}
        <div>
          <h1 class="text-xl font-bold tracking-tight">Shangrilá Informes</h1>
          ${state.fetchingInfo ? `
            <div class="h-3 w-24 bg-slate-100 rounded mt-1 animate-pulse"></div>
          ` : `
            <p class="text-xs text-slate-500 uppercase tracking-widest font-semibold">Grupo ${currentGroup} • Shangrilá</p>
          `}
        </div>
      </div>

      <div class="flex items-center gap-2 sm:gap-4">
        <!-- View Navigation Buttons -->
        <div class="bg-slate-100 p-1 rounded-xl flex items-center gap-1 border border-slate-200">
          <button id="view-table-btn" class="px-3 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer ${state.currentView === 'table' ? 'bg-white text-indigo-600 shadow-xs' : 'text-slate-600 hover:text-slate-900'}">
            <i data-lucide="table" class="w-4 h-4"></i>
            <span class="hidden sm:inline">Informes</span>
          </button>
          <button id="view-cards-btn" class="px-3 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer ${state.currentView === 'cards' ? 'bg-white text-indigo-600 shadow-xs' : 'text-slate-600 hover:text-slate-900'}">
            <i data-lucide="contact" class="w-4 h-4"></i>
            <span>Tarjetas Publicador</span>
          </button>
        </div>

        ${state.currentView === 'table' ? `
          <div class="flex flex-col text-right">
            <label for="period-select" class="text-[10px] text-slate-400 font-bold uppercase tracking-wider mb-0.5">Periodo</label>
            <select id="period-select" class="bg-slate-50 border border-slate-200 text-xs font-bold text-slate-700 rounded-lg px-2.5 py-1 focus:ring-1 focus:ring-indigo-500 focus:border-indigo-500 outline-none cursor-pointer transition-all">
              ${PERIODS.map(p => `
                <option value="${p.value}" ${state.selectedPeriod === p.value ? 'selected' : ''}>${p.value}</option>
              `).join('')}
            </select>
          </div>
        ` : ''}

        <button id="logout-btn" class="p-2 text-slate-400 hover:text-red-500 transition-colors bg-slate-50 rounded-lg cursor-pointer" title="Cerrar sesión">
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
    <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 px-10 py-6 flex-shrink-0">
      ${StatCard("Publicadores", groupData.length)}
      ${StatCard("Activos", activos)}
      ${StatCard("Auxiliares", auxiliares)}
      ${StatCard("Regulares", regulares)}
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
          <div class="col-span-2 px-4">Notas / Observaciones</div>
        </div>

        <div class="flex-grow overflow-y-auto">
          ${groupData.map((pub, idx) => `
            <!-- Desktop Row -->
            <div data-pub-id="${pub.id}" class="hidden md:grid grid-cols-12 border-b border-slate-100 hover:bg-indigo-50/20 transition-colors items-center min-h-[3.5rem] ${idx % 2 === 1 ? 'bg-slate-50/30' : ''}">
              <div class="col-span-3 px-8 font-semibold text-sm text-slate-700">${pub.nombre}</div>
              
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
                <span class="font-bold text-slate-800 text-base">${pub.nombre}</span>
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
    { id: 1, label: 'G1' },
    { id: 2, label: 'G2' },
    { id: 3, label: 'G3' },
    { id: 4, label: 'G4' },
    { id: 5, label: 'G5' },
    { id: 6, label: 'G6' },
    { id: 7, label: 'G7' },
    { id: 'men', label: 'Varones' },
    { id: 'pioneers', label: 'Precursores' },
  ];

  const yearMonths = MONTH_CONFIGS.filter(m => m.serviceYear === selectedYear);

  return `
    <div class="px-4 sm:px-10 py-6 flex-grow flex flex-col min-h-0 pb-12">
      <!-- Top Controls & Selector Bar (Hidden on Print) -->
      <div class="bg-white rounded-2xl border border-slate-200 shadow-xs p-4 mb-6 space-y-4 print:hidden">
        
        <!-- Filter Tabs -->
        <div class="space-y-1">
          <label class="block text-[10px] font-bold text-slate-400 uppercase tracking-widest">
            Filtrar por Grupo o Categoría
          </label>
          <div class="flex flex-wrap gap-1.5 items-center overflow-x-auto pb-1">
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

        <!-- Search Bar, Dropdown & Service Year -->
        <div class="grid grid-cols-1 md:grid-cols-12 gap-3 pt-2 border-t border-slate-200 items-center">
          
          <!-- Search input -->
          <div class="md:col-span-4 relative">
            <input
              type="text"
              id="cards-search-input"
              placeholder="Buscar por nombre, familia, whatsapp..."
              class="w-full pl-8 pr-8 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 font-medium"
              value="${state.cardsSearchTerm}"
            />
            <i data-lucide="search" class="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-2.5"></i>
            ${state.cardsSearchTerm ? `
              <button id="cards-clear-search" class="absolute right-2.5 top-2 text-slate-400 hover:text-slate-600 text-xs font-bold cursor-pointer">✕</button>
            ` : ''}
          </div>

          <!-- Dropdown Select & Prev/Next Buttons -->
          <div class="md:col-span-5 flex items-center gap-1.5">
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
                return `<option value="${p.id}" ${isSel ? 'selected' : ''}>${p.nombre} (G${p.grupo})${appt}${prec}</option>`;
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

          <!-- Service Year Toggle Buttons -->
          <div class="md:col-span-3 flex justify-end gap-1.5">
            <button
              id="sy2026-btn"
              class="flex-1 py-2 px-2 text-xs rounded-xl transition-all text-center font-bold cursor-pointer ${selectedYear === 2026 ? 'bg-indigo-600 text-white shadow-xs' : 'bg-slate-100 text-slate-700 hover:bg-slate-200'}"
            >
              Año 2026
            </button>
            <button
              id="sy2025-btn"
              class="flex-1 py-2 px-2 text-xs rounded-xl transition-all text-center font-bold cursor-pointer ${selectedYear === 2025 ? 'bg-indigo-600 text-white shadow-xs' : 'bg-slate-100 text-slate-700 hover:bg-slate-200'}"
            >
              Año 2025
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
            
            <!-- Top Actions Bar (Hidden on print) -->
            <div class="flex items-center justify-between border-b border-slate-200 pb-4 mb-6 print:hidden">
              <div class="flex items-center gap-2">
                <span class="bg-indigo-600 text-white font-mono font-bold text-xs px-3 py-1 rounded-lg">
                  G${selectedPub.grupo}
                </span>
                <span class="text-xs font-bold text-slate-600 uppercase tracking-wider">
                  ${selectedPub.family ? `Familia ${selectedPub.family}` : 'Publicador'}
                </span>
              </div>

              <div class="flex items-center gap-2">
                <button id="edit-publisher-card-btn" class="px-3.5 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs font-bold rounded-xl border border-slate-200 transition-colors flex items-center gap-1.5 cursor-pointer">
                  <i data-lucide="edit-3" class="w-3.5 h-3.5"></i>
                  <span>Editar Registro</span>
                </button>
                <button id="print-card-btn" class="px-4 py-1.5 bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold rounded-xl transition-all flex items-center gap-1.5 cursor-pointer shadow-xs">
                  <i data-lucide="printer" class="w-3.5 h-3.5"></i>
                  <span>Imprimir S-21-S</span>
                </button>
              </div>
            </div>

            <!-- Form Official Header -->
            <div class="border-b-2 border-slate-900 pb-3 mb-4">
              <div class="flex justify-between items-start">
                <div>
                  <h1 class="font-extrabold text-base md:text-lg tracking-tight uppercase text-slate-900">
                    REGISTRO DE PUBLICADOR DE LA CONGREGACIÓN
                  </h1>
                  <p class="text-[11px] font-semibold text-slate-500 uppercase tracking-wider">
                    Formulario Oficial de Actividad del Ministerio
                  </p>
                </div>
                <div class="text-right">
                  <span class="text-xs font-mono font-bold bg-slate-100 border border-slate-300 px-2 py-0.5 rounded-sm">
                    S-21-S
                  </span>
                  <div class="text-[10px] text-slate-500 font-bold uppercase mt-1">
                    Año de Servicio ${selectedYear}
                  </div>
                </div>
              </div>
            </div>

            <!-- Personal Info Grid -->
            <div class="grid grid-cols-2 md:grid-cols-4 gap-3 bg-slate-50 p-4 rounded-xl border border-slate-200 mb-5 text-xs">
              <div>
                <span class="block text-[9px] font-bold text-slate-400 uppercase tracking-widest mb-0.5">Nombre</span>
                <span class="font-bold text-slate-900 block text-xs md:text-sm truncate">${selectedPub.nombre}</span>
              </div>

              <div>
                <span class="block text-[9px] font-bold text-slate-400 uppercase tracking-widest mb-0.5">Familia / Grupo</span>
                <span class="font-semibold text-slate-800 block text-xs">
                  ${selectedPub.family ? selectedPub.family : '—'} • Grupo ${selectedPub.grupo}
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
                <span class="font-bold block text-xs ${isRegPioneer ? 'text-amber-700' : 'text-slate-700'}">
                  ${isRegPioneer ? 'Precursor Regular' : 'Publicador'}
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
                    <th class="py-2.5 px-2 text-center border-r border-slate-700">Participó</th>
                    <th class="py-2.5 px-2 text-center border-r border-slate-700">Cursos Bíblicos</th>
                    <th class="py-2.5 px-3 text-center border-r border-slate-700">Precursorado</th>
                    <th class="py-2.5 px-3 text-center border-r border-slate-700">Horas</th>
                    <th class="py-2.5 px-3">Notas / Observaciones</th>
                  </tr>
                </thead>
                <tbody class="divide-y divide-slate-200">
                  ${yearMonths.map(m => {
                    const act = selectedPub.monthlyData[m.key] || {};
                    const hasNotes = act.notes && act.notes.trim() !== '';
                    const precLabel = act.pioneerType || (act.isAuxiliaryPioneer ? 'Auxiliar 15 hs' : '—');
                    
                    return `
                      <tr class="hover:bg-slate-50 transition-colors">
                        <td class="py-2.5 px-3 font-bold text-slate-900 border-r border-slate-200">
                          <span class="hidden md:inline">${m.label} ${m.year}</span>
                          <span class="md:hidden">${m.shortLabel}</span>
                        </td>

                        <td class="py-2.5 px-2 text-center border-r border-slate-200 font-bold">
                          ${act.participated
                            ? '<span class="text-emerald-700 font-extrabold text-sm">✓</span>'
                            : '<span class="text-slate-300 font-medium">—</span>'}
                        </td>

                        <td class="py-2.5 px-2 text-center font-mono font-bold text-slate-900 border-r border-slate-200">
                          ${act.bibleStudies !== null && act.bibleStudies !== undefined ? act.bibleStudies : '—'}
                        </td>

                        <td class="py-2.5 px-3 text-center border-r border-slate-200 font-medium text-xs">
                          ${act.pioneerType || act.isAuxiliaryPioneer
                            ? `<span class="px-2 py-0.5 rounded-md text-[10px] font-bold bg-slate-800 text-white">${precLabel}</span>`
                            : '<span class="text-slate-400">—</span>'}
                        </td>

                        <td class="py-2.5 px-3 text-center font-mono font-bold text-slate-900 border-r border-slate-200 bg-slate-50/50">
                          ${act.hours !== null && act.hours !== undefined ? `${act.hours} h` : '—'}
                        </td>

                        <td class="py-2.5 px-3 text-slate-600 text-[11px] truncate max-w-xs">
                          ${hasNotes ? act.notes : '—'}
                        </td>
                      </tr>
                    `;
                  }).join('')}
                </tbody>

                <tfoot>
                  <tr class="bg-slate-100 border-t-2 border-slate-900 text-slate-900 font-bold text-xs">
                    <td class="py-2.5 px-3 border-r border-slate-300">TOTALES (${activeMonthsCount > 0 ? activeMonthsCount : 12} MESES)</td>
                    
                    <td class="py-2.5 px-2 text-center border-r border-slate-300 font-mono">
                      ${monthsParticipated} / ${activeMonthsCount > 0 ? activeMonthsCount : 12}
                    </td>

                    <td class="py-2.5 px-2 text-center border-r border-slate-300 font-mono">
                      ${totalStudies > 0 ? totalStudies : '—'}
                    </td>

                    <td class="py-2.5 px-3 text-center border-r border-slate-300 text-[11px]">
                      —
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

          </div>
        `;
      })()}
    </div>

    <!-- EDIT MODAL DIALOG -->
    ${state.cardsEditingPub ? RenderEditModal(state.cardsEditingPub) : ''}
  `;
}

function RenderEditModal(pub) {
  const currentMonthKey = state.cardsModalMonthKey || '2025-09';
  const act = pub.monthlyData[currentMonthKey] || {};

  return `
    <div id="cards-edit-modal" class="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs print:hidden">
      <div class="bg-white rounded-2xl shadow-2xl border border-slate-200 w-full max-w-2xl max-h-[90vh] flex flex-col overflow-hidden font-sans">
        
        <!-- Header -->
        <div class="bg-slate-900 text-white p-4 flex items-center justify-between">
          <div>
            <h3 class="font-bold text-base tracking-tight uppercase">EDITAR REGISTRO DE PUBLICADOR</h3>
            <p class="text-xs text-slate-400 font-medium">${pub.nombre} • Grupo ${pub.grupo}</p>
          </div>
          <button id="close-modal-btn" class="p-1 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors cursor-pointer">
            <i data-lucide="x" class="w-5 h-5"></i>
          </button>
        </div>

        <!-- Modal Tabs -->
        <div class="flex border-b border-slate-200 bg-slate-50 px-4">
          <button
            id="modal-tab-info"
            class="py-3 px-4 font-bold text-xs uppercase tracking-wider border-b-2 border-indigo-600 text-indigo-600 bg-white transition-colors cursor-pointer"
          >
            Datos Personales
          </button>
          <button
            id="modal-tab-activity"
            class="py-3 px-4 font-bold text-xs uppercase tracking-wider border-b-2 border-transparent text-slate-400 hover:text-slate-700 transition-colors cursor-pointer"
          >
            Editar Actividad Mensual
          </button>
        </div>

        <!-- Modal Body -->
        <div class="p-6 overflow-y-auto flex-1 space-y-4">
          
          <!-- Tab 1: Personal Info -->
          <div id="modal-body-info" class="space-y-4 text-sm">
            <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label class="block text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">Nombre completo</label>
                <input id="edit-pub-name" type="text" class="w-full px-3 py-2 border border-slate-300 rounded-xl focus:border-indigo-600 focus:outline-none bg-slate-50 text-slate-900 font-medium" value="${pub.nombre}" />
              </div>
              <div>
                <label class="block text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">Grupo de Servicio</label>
                <input id="edit-pub-group" type="number" min="1" max="10" class="w-full px-3 py-2 border border-slate-300 rounded-xl focus:border-indigo-600 focus:outline-none bg-slate-50 text-slate-900 font-medium" value="${pub.grupo}" />
              </div>
            </div>

            <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label class="block text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">Fecha Nacimiento (DD/MM/AAAA)</label>
                <input id="edit-pub-birth" type="text" placeholder="e.g. 21/12/1951" class="w-full px-3 py-2 border border-slate-300 rounded-xl focus:border-indigo-600 focus:outline-none bg-slate-50 text-slate-900 font-mono text-xs" value="${pub.birthDate || ''}" />
              </div>
              <div>
                <label class="block text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">Fecha Bautismo (DD/MM/AAAA)</label>
                <input id="edit-pub-baptism" type="text" placeholder="e.g. 11/09/1978" class="w-full px-3 py-2 border border-slate-300 rounded-xl focus:border-indigo-600 focus:outline-none bg-slate-50 text-slate-900 font-mono text-xs" value="${pub.baptismDate || ''}" />
              </div>
            </div>

            <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label class="block text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">Familia</label>
                <input id="edit-pub-family" type="text" placeholder="e.g. Acuña" class="w-full px-3 py-2 border border-slate-300 rounded-xl focus:border-indigo-600 focus:outline-none bg-slate-50 text-slate-900 text-xs" value="${pub.family || ''}" />
              </div>
              <div>
                <label class="block text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">Teléfono / WhatsApp</label>
                <input id="edit-pub-whatsapp" type="text" placeholder="e.g. 091324703" class="w-full px-3 py-2 border border-slate-300 rounded-xl focus:border-indigo-600 focus:outline-none bg-slate-50 text-slate-900 font-mono text-xs" value="${pub.whatsapp || ''}" />
              </div>
            </div>

            <div class="grid grid-cols-1 md:grid-cols-2 gap-4 pt-3 border-t border-slate-200">
              <div>
                <label class="block text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-2">Género</label>
                <div class="flex gap-4 items-center">
                  <label class="flex items-center gap-2 cursor-pointer font-medium text-slate-800 text-xs">
                    <input type="radio" name="edit-gender" value="H" ${pub.gender === 'H' ? 'checked' : ''} />
                    <span>Hombre</span>
                  </label>
                  <label class="flex items-center gap-2 cursor-pointer font-medium text-slate-800 text-xs">
                    <input type="radio" name="edit-gender" value="M" ${pub.gender !== 'H' ? 'checked' : ''} />
                    <span>Mujer</span>
                  </label>
                </div>
              </div>

              <div>
                <label class="block text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-2">Nombramiento</label>
                <select id="edit-pub-nomb" class="w-full px-3 py-2 border border-slate-300 rounded-xl text-xs font-bold bg-slate-50">
                  <option value="" ${!pub.appointment ? 'selected' : ''}>Publicador</option>
                  <option value="A" ${pub.appointment === 'A' ? 'selected' : ''}>Anciano</option>
                  <option value="SM" ${pub.appointment === 'SM' ? 'selected' : ''}>Siervo Ministerial</option>
                </select>
              </div>
            </div>
          </div>

          <!-- Tab 2: Activity -->
          <div id="modal-body-activity" class="space-y-4 text-sm hidden">
            <div>
              <label class="block text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">Seleccionar Mes a Editar</label>
              <select id="modal-month-select" class="w-full px-3 py-2 border border-slate-300 rounded-xl font-bold text-slate-900 bg-slate-50 focus:border-indigo-600 focus:outline-none">
                ${MONTH_CONFIGS.map(m => `
                  <option value="${m.key}" ${currentMonthKey === m.key ? 'selected' : ''}>${m.label} ${m.year} (AS ${m.serviceYear})</option>
                `).join('')}
              </select>
            </div>

            <div class="bg-slate-50 p-4 rounded-xl border border-slate-200 space-y-4">
              
              <label class="flex items-center gap-3 p-3 bg-white rounded-xl border border-slate-200 cursor-pointer hover:bg-slate-100 transition-colors">
                <input id="edit-month-participated" type="checkbox" class="w-4 h-4 text-indigo-600 rounded" ${act.participated ? 'checked' : ''} />
                <div>
                  <span class="font-bold text-slate-900 block text-xs">Participó en el ministerio este mes</span>
                  <span class="text-[11px] text-slate-400 font-medium">Marcar casilla de participación</span>
                </div>
              </label>

              <div>
                <label class="block text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">Precursorado en este Mes</label>
                <select id="edit-month-pioneer" class="w-full px-3 py-2 border border-slate-300 rounded-xl font-medium text-xs text-slate-900 bg-white focus:border-indigo-600 focus:outline-none">
                  <option value="" ${!act.pioneerType ? 'selected' : ''}>Ninguno (Publicador)</option>
                  <option value="Auxiliar 15 hs" ${act.pioneerType === 'Auxiliar 15 hs' ? 'selected' : ''}>Auxiliar 15 hs</option>
                  <option value="Auxiliar 30 hs" ${act.pioneerType === 'Auxiliar 30 hs' ? 'selected' : ''}>Auxiliar 30 hs</option>
                  <option value="Regular" ${act.pioneerType === 'Regular' ? 'selected' : ''}>Regular</option>
                </select>
              </div>

              <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label class="block text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">Cursos Bíblicos</label>
                  <input id="edit-month-studies" type="number" min="0" placeholder="e.g. 1" class="w-full px-3 py-2 border border-slate-300 rounded-xl focus:border-indigo-600 focus:outline-none bg-white font-mono text-xs font-bold" value="${act.bibleStudies !== null && act.bibleStudies !== undefined ? act.bibleStudies : ''}" />
                </div>
                <div>
                  <label class="block text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">Horas Registradas</label>
                  <input id="edit-month-hours" type="number" min="0" placeholder="e.g. 15" class="w-full px-3 py-2 border border-slate-300 rounded-xl focus:border-indigo-600 focus:outline-none bg-white font-mono text-xs font-bold" value="${act.hours !== null && act.hours !== undefined ? act.hours : ''}" />
                </div>
              </div>

              <div>
                <label class="block text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">Notas / Observaciones</label>
                <input id="edit-month-notes" type="text" placeholder="e.g. Enfermo..." class="w-full px-3 py-2 border border-slate-300 rounded-xl focus:border-indigo-600 focus:outline-none bg-white text-xs" value="${act.notes || ''}" />
              </div>

            </div>
          </div>

        </div>

        <!-- Footer -->
        <div class="bg-slate-50 p-4 border-t border-slate-200 flex items-center justify-end gap-3">
          <button id="cancel-modal-btn" class="px-4 py-2 text-xs font-bold text-slate-700 bg-white border border-slate-300 rounded-xl hover:bg-slate-100 transition-colors cursor-pointer">
            Cancelar
          </button>
          <button id="save-modal-btn" class="px-5 py-2 text-xs font-bold text-white bg-indigo-600 rounded-xl hover:bg-indigo-700 transition-all shadow-xs flex items-center gap-1.5 cursor-pointer">
            <span>Guardar Cambios</span>
          </button>
        </div>

      </div>
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

async function handleSaveCardEdits() {
  const pub = state.cardsEditingPub;
  if (!pub) return;

  const newName = $('#edit-pub-name').val();
  const newGroup = parseInt($('#edit-pub-group').val(), 10) || 1;
  const newBirth = $('#edit-pub-birth').val();
  const newBaptism = $('#edit-pub-baptism').val();
  const newFamily = $('#edit-pub-family').val();
  const newWhatsApp = $('#edit-pub-whatsapp').val();
  const newGender = $('input[name="edit-gender"]:checked').val() || 'M';
  const newNomb = $('#edit-pub-nomb').val() || '';

  const monthKey = $('#modal-month-select').val();
  const monthAct = pub.monthlyData[monthKey] || {};

  const newPart = $('#edit-month-participated').is(':checked');
  const newPioneer = $('#edit-month-pioneer').val();
  const newStudies = $('#edit-month-studies').val();
  const newHours = $('#edit-month-hours').val();
  const newNotes = $('#edit-month-notes').val();

  setState({ cardsEditingPub: null });

  try {
    // Update personal fields in Google Sheets if colIndices exist
    if (pub.colIndices) {
      if (pub.colIndices.nombre !== -1) await updateCell(`${getColumnLetter(pub.colIndices.nombre)}${pub.rowIndex}`, newName);
      if (pub.colIndices.grupo !== -1) await updateCell(`${getColumnLetter(pub.colIndices.grupo)}${pub.rowIndex}`, newGroup);
      if (pub.colIndices.whatsapp !== -1) await updateCell(`${getColumnLetter(pub.colIndices.whatsapp)}${pub.rowIndex}`, newWhatsApp);
      if (pub.colIndices.nacimiento !== -1) await updateCell(`${getColumnLetter(pub.colIndices.nacimiento)}${pub.rowIndex}`, newBirth);
      if (pub.colIndices.bautismo !== -1) await updateCell(`${getColumnLetter(pub.colIndices.bautismo)}${pub.rowIndex}`, newBaptism);
      if (pub.colIndices.h_m !== -1) await updateCell(`${getColumnLetter(pub.colIndices.h_m)}${pub.rowIndex}`, newGender);
      if (pub.colIndices.nombramiento !== -1) await updateCell(`${getColumnLetter(pub.colIndices.nombramiento)}${pub.rowIndex}`, newNomb);
      if (pub.colIndices.familia !== -1) await updateCell(`${getColumnLetter(pub.colIndices.familia)}${pub.rowIndex}`, newFamily);
    }

    // Update month fields
    if (monthAct.colIndices) {
      if (monthAct.colIndices.participo !== -1) await updateCell(`${getColumnLetter(monthAct.colIndices.participo)}${pub.rowIndex}`, newPart ? 'TRUE' : 'FALSE');
      if (monthAct.colIndices.cursos !== -1) await updateCell(`${getColumnLetter(monthAct.colIndices.cursos)}${pub.rowIndex}`, newStudies);
      if (monthAct.colIndices.precursorado !== -1) await updateCell(`${getColumnLetter(monthAct.colIndices.precursorado)}${pub.rowIndex}`, newPioneer);
      if (monthAct.colIndices.horas !== -1) await updateCell(`${getColumnLetter(monthAct.colIndices.horas)}${pub.rowIndex}`, newHours);
      if (monthAct.colIndices.notas !== -1) await updateCell(`${getColumnLetter(monthAct.colIndices.notas)}${pub.rowIndex}`, newNotes);
    }

    // Reload fresh data from sheets
    await loadData();
  } catch (err) {
    console.error('Error saving card edits:', err);
    setState({ error: `Error al guardar cambios: ${err.message}` });
  }
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
  $('#logout-btn').on('click', logout);
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

  // --- Tarjetas View Handlers ---
  $('.cards-tab-btn').on('click', function() {
    const tabAttr = $(this).data('card-tab');
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

  $('#print-card-btn').on('click', () => {
    window.print();
  });

  $('#edit-publisher-card-btn').on('click', () => {
    const pub = state.fullPublishers.find(p => p.id === state.cardsSelectedPubId);
    if (pub) {
      setState({ cardsEditingPub: pub });
    }
  });

  // Modal events
  $('#close-modal-btn, #cancel-modal-btn').on('click', () => {
    setState({ cardsEditingPub: null });
  });

  $('#modal-tab-info').on('click', function() {
    $('#modal-tab-info').addClass('border-indigo-600 text-indigo-600 bg-white').removeClass('border-transparent text-slate-400');
    $('#modal-tab-activity').addClass('border-transparent text-slate-400').removeClass('border-indigo-600 text-indigo-600 bg-white');
    $('#modal-body-info').removeClass('hidden');
    $('#modal-body-activity').addClass('hidden');
  });

  $('#modal-tab-activity').on('click', function() {
    $('#modal-tab-activity').addClass('border-indigo-600 text-indigo-600 bg-white').removeClass('border-transparent text-slate-400');
    $('#modal-tab-info').addClass('border-transparent text-slate-400').removeClass('border-indigo-600 text-indigo-600 bg-white');
    $('#modal-body-activity').removeClass('hidden');
    $('#modal-body-info').addClass('hidden');
  });

  $('#modal-month-select').on('change', function() {
    const selectedKey = $(this).val();
    setState({ cardsModalMonthKey: selectedKey });
  });

  $('#save-modal-btn').on('click', () => {
    handleSaveCardEdits();
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
