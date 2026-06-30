const COURSES = [
      { code: "CS", name: "B.Sc. in Computer Science" },
      { code: "IT", name: "B.Sc. in Information Technology" },
      { code: "DS", name: "B.Sc. in Data Science" }
    ];
    const SEMESTERS = ["1", "2", "3", "4", "5", "6"];
    const EXAM_YEAR = "2026";
    const EXAM_TITLE = `Practical Examination ${EXAM_YEAR}`;
    const FIREBASE_CONFIG = {
      apiKey: "AIzaSyB9Gp5_rrLoIl6gubai-BLcIJbPWQbK4qk",
      authDomain: "gen-lang-client-0157565271.firebaseapp.com",
      databaseURL: "https://gen-lang-client-0157565271-default-rtdb.firebaseio.com",
      projectId: "gen-lang-client-0157565271",
      storageBucket: "gen-lang-client-0157565271.firebasestorage.app",
      messagingSenderId: "745621512272",
      appId: "1:745621512272:web:87517059cac3b6e15cb155"
    };
    const FIREBASE_DATA_ROOT = "exams/practicalExamination2026";
    const SECTION_IDS = ["1", "2", "3"];
    const PAPER_ACCESS_CODE_COUNT = 5;
    const VIVA_ACCESS_CODE_COUNT = 10;
    const VIVA_ACCESS_CODE_LENGTH = 4;
    const PUBLIC_TABS = new Set(["adminView", "studentView", "vivaView"]);
    const VALID_TABS = new Set([
      "dashboardView",
      "coursesView",
      "semestersView",
      "subjectsView",
      "papersView",
      "adminView",
      "recordsView",
      "settingsView",
      "studentView",
      "vivaView"
    ]);
    const STOPWORDS = new Set([
      "about", "above", "after", "again", "against", "also", "and", "are", "because", "been", "being", "between",
      "can", "could", "data", "does", "each", "from", "have", "into", "its", "more", "must", "only", "other",
      "over", "practical", "program", "should", "that", "the", "their", "there", "these", "this", "through",
      "using", "what", "when", "where", "which", "while", "with", "will", "write", "your"
    ]);

    let state = loadState();
    let currentAttemptKey = "";
    let currentAdmin = null;
    let adminQuestions = { "1": [], "2": [], "3": [] };
    let editingSubjectId = "";
    let accessCodesVisible = false;
    let firebaseServices = null;
    let firebaseStatusMessage = "";
    let firebasePublicListeners = [];
    let firebaseAdminListener = null;

    const el = {
      adminLoginPanel: document.getElementById("adminLoginPanel"),
      adminDashboard: document.getElementById("adminDashboard"),
      currentAdminName: document.getElementById("currentAdminName"),
      headerAdminName: document.getElementById("headerAdminName"),
      adminLoginTitle: document.getElementById("adminLoginTitle"),
      adminLoginHelp: document.getElementById("adminLoginHelp"),
      adminLoginBtnText: document.getElementById("adminLoginBtnText"),
      adminLoginUsername: document.getElementById("adminLoginUsername"),
      adminLoginPassword: document.getElementById("adminLoginPassword"),
      adminLoginStatus: document.getElementById("adminLoginStatus"),
      newAdminName: document.getElementById("newAdminName"),
      newAdminUsername: document.getElementById("newAdminUsername"),
      newAdminPassword: document.getElementById("newAdminPassword"),
      newAdminStatus: document.getElementById("newAdminStatus"),
      adminList: document.getElementById("adminList"),
      adminCourse: document.getElementById("adminCourse"),
      adminSemester: document.getElementById("adminSemester"),
      adminPracticalName: document.getElementById("adminPracticalName"),
      adminPracticalList: document.getElementById("adminPracticalList"),
      adminSessionBadge: document.getElementById("adminSessionBadge"),
      section1Target: document.getElementById("section1Target"),
      section2Target: document.getElementById("section2Target"),
      section3Target: document.getElementById("section3Target"),
      section1QuestionInput: document.getElementById("section1QuestionInput"),
      section2QuestionInput: document.getElementById("section2QuestionInput"),
      section3QuestionInput: document.getElementById("section3QuestionInput"),
      addSection1Question: document.getElementById("addSection1Question"),
      addSection2Question: document.getElementById("addSection2Question"),
      addSection3Question: document.getElementById("addSection3Question"),
      section1List: document.getElementById("section1List"),
      section2List: document.getElementById("section2List"),
      section3List: document.getElementById("section3List"),
      section1Progress: document.getElementById("section1Progress"),
      section2Progress: document.getElementById("section2Progress"),
      section3Progress: document.getElementById("section3Progress"),
      section1Count: document.getElementById("section1Count"),
      section2Count: document.getElementById("section2Count"),
      section3Count: document.getElementById("section3Count"),
      enableSection3: document.getElementById("enableSection3"),
      vivaSyllabus: document.getElementById("vivaSyllabus"),
      syllabusFile: document.getElementById("syllabusFile"),
      tokenList: document.getElementById("tokenList"),
      viewAccessCodesBtn: document.getElementById("viewAccessCodesBtn"),
      viewAccessCodesText: document.getElementById("viewAccessCodesText"),
      copyTokensBtn: document.getElementById("copyTokensBtn"),
      testState: document.getElementById("testState"),
      testStateTitle: document.getElementById("testStateTitle"),
      testStateMeta: document.getElementById("testStateMeta"),
      activateTestBtn: document.getElementById("activateTestBtn"),
      deleteActiveTestBtn: document.getElementById("deleteActiveTestBtn"),
      activeTestList: document.getElementById("activeTestList"),
      adminSummary: document.getElementById("adminSummary"),
      adminStatus: document.getElementById("adminStatus"),
      studentName: document.getElementById("studentName"),
      studentRoll: document.getElementById("studentRoll"),
      studentContact: document.getElementById("studentContact"),
      studentEmail: document.getElementById("studentEmail"),
      studentCourse: document.getElementById("studentCourse"),
      studentSemester: document.getElementById("studentSemester"),
      studentPractical: document.getElementById("studentPractical"),
      studentToken: document.getElementById("studentToken"),
      studentStatus: document.getElementById("studentStatus"),
      paperOutput: document.getElementById("paperOutput"),
      changePaperBtn: document.getElementById("changePaperBtn"),
      downloadPdfBtn: document.getElementById("downloadPdfBtn"),
      vivaToken: document.getElementById("vivaToken"),
      vivaStatus: document.getElementById("vivaStatus"),
      vivaOutput: document.getElementById("vivaOutput"),
      recordsOutput: document.getElementById("recordsOutput"),
      dashboardSummaryText: document.getElementById("dashboardSummaryText"),
      recordsSummaryText: document.getElementById("recordsSummaryText"),
      recordBankCount: document.getElementById("recordBankCount"),
      recordPaperCount: document.getElementById("recordPaperCount"),
      recordVivaCount: document.getElementById("recordVivaCount"),
      settingsStatus: document.getElementById("settingsStatus"),
      metricBanks: document.getElementById("metricBanks"),
      metricActiveTests: document.getElementById("metricActiveTests"),
      metricAttempts: document.getElementById("metricAttempts"),
      courseCards: document.getElementById("courseCards"),
      semesterCourseFilter: document.getElementById("semesterCourseFilter"),
      semesterTableBody: document.getElementById("semesterTableBody"),
      subjectCourse: document.getElementById("subjectCourse"),
      subjectSemester: document.getElementById("subjectSemester"),
      subjectName: document.getElementById("subjectName"),
      subjectCode: document.getElementById("subjectCode"),
      subjectType: document.getElementById("subjectType"),
      subjectCredits: document.getElementById("subjectCredits"),
      subjectMarks: document.getElementById("subjectMarks"),
      subjectSyllabus: document.getElementById("subjectSyllabus"),
      subjectFormTitle: document.getElementById("subjectFormTitle"),
      subjectFormStatus: document.getElementById("subjectFormStatus"),
      subjectFilterCourse: document.getElementById("subjectFilterCourse"),
      subjectFilterSemester: document.getElementById("subjectFilterSemester"),
      subjectFilterType: document.getElementById("subjectFilterType"),
      subjectTableBody: document.getElementById("subjectTableBody"),
      paperBankCount: document.getElementById("paperBankCount"),
      paperActiveCount: document.getElementById("paperActiveCount"),
      paperGeneratedCount: document.getElementById("paperGeneratedCount"),
      paperBankTableBody: document.getElementById("paperBankTableBody"),
      generatedPaperTableBody: document.getElementById("generatedPaperTableBody")
    };

    boot();

    function boot() {
      fillCourseOptions(el.adminCourse);
      fillCourseOptions(el.studentCourse);
      fillCourseOptions(el.subjectCourse);
      fillSemesterOptions(el.adminSemester);
      fillSemesterOptions(el.studentSemester);
      fillSemesterOptions(el.subjectSemester);
      fillCourseFilterOptions(el.semesterCourseFilter);
      fillCourseFilterOptions(el.subjectFilterCourse);
      fillSemesterFilterOptions(el.subjectFilterSemester);
      bindEvents();
      updateSectionCounts();
      updateAdminPracticalList();
      updateStudentPracticals();
      renderAdminBank();
      renderAdminAuth();
      clearSubjectForm(false);
      renderAllSummaries();
      switchTab("studentView");
      initializeFirebase();
    }

    function bindEvents() {
      document.querySelectorAll(".tab-button").forEach((button) => {
        button.addEventListener("click", () => switchTab(button.dataset.tab));
      });
      document.querySelectorAll("[data-jump-tab]").forEach((button) => {
        button.addEventListener("click", () => switchTab(button.dataset.jumpTab));
      });
      document.querySelectorAll("[data-action='export-records']").forEach((button) => {
        button.addEventListener("click", exportRecords);
      });
      document.querySelectorAll("[data-action='refresh-summaries']").forEach((button) => {
        button.addEventListener("click", () => {
          renderAllSummaries();
          setStatus(el.settingsStatus, "Dashboard and record counts refreshed.", "ok");
        });
      });

      el.courseCards.addEventListener("click", handleCourseCardAction);
      el.semesterCourseFilter.addEventListener("change", renderSemesters);
      [el.subjectFilterCourse, el.subjectFilterSemester, el.subjectFilterType].forEach((select) => {
        select.addEventListener("change", renderSubjects);
      });
      document.getElementById("saveSubjectBtn").addEventListener("click", saveSubject);
      document.getElementById("resetSubjectBtn").addEventListener("click", () => clearSubjectForm(true));
      el.subjectTableBody.addEventListener("click", handleSubjectTableAction);
      el.subjectName.addEventListener("blur", () => {
        if (!el.subjectCode.value.trim()) {
          el.subjectCode.value = suggestSubjectCode(el.subjectName.value);
        }
      });

      document.getElementById("adminLoginBtn").addEventListener("click", loginAdmin);
      document.getElementById("adminLogoutBtn").addEventListener("click", logoutAdmin);
      document.getElementById("addAdminBtn").addEventListener("click", addNewAdmin);
      [el.adminLoginUsername, el.adminLoginPassword].forEach((input) => {
        input.addEventListener("keydown", (event) => {
          if (event.key === "Enter") {
            loginAdmin();
          }
        });
      });

      el.adminCourse.addEventListener("change", () => {
        updateAdminPracticalList();
        renderAdminBank();
      });
      el.adminSemester.addEventListener("change", () => {
        updateAdminPracticalList();
        renderAdminBank();
      });
      el.adminPracticalName.addEventListener("change", renderAdminBank);
      document.getElementById("loadPracticalBtn").addEventListener("click", renderAdminBank);
      document.getElementById("saveBankBtn").addEventListener("click", saveAdminDraft);
      document.getElementById("finalizeBtn").addEventListener("click", finalizeSession);
      el.viewAccessCodesBtn.addEventListener("click", toggleAccessCodeVisibility);
      el.copyTokensBtn.addEventListener("click", copyTokens);
      el.tokenList.addEventListener("click", handleTokenListAction);
      el.activateTestBtn.addEventListener("click", activateSelectedTest);
      el.deleteActiveTestBtn.addEventListener("click", () => deleteActiveTest(getAdminId()));
      el.activeTestList.addEventListener("click", handleActiveTestAction);

      el.addSection1Question.addEventListener("click", () => addSectionQuestion("1"));
      el.addSection2Question.addEventListener("click", () => addSectionQuestion("2"));
      el.addSection3Question.addEventListener("click", () => addSectionQuestion("3"));
      [el.section1QuestionInput, el.section2QuestionInput, el.section3QuestionInput].forEach((textarea) => {
        textarea.addEventListener("keydown", (event) => {
          if (event.key === "Enter" && (event.ctrlKey || event.metaKey)) {
            const sectionId = textarea.id.replace("section", "").replace("QuestionInput", "");
            addSectionQuestion(sectionId);
          }
        });
      });
      [el.section1Target, el.section2Target, el.section3Target].forEach((input) => {
        input.addEventListener("input", updateSectionCounts);
      });
      [el.section1List, el.section2List, el.section3List].forEach((list) => {
        list.addEventListener("click", handleQuestionListAction);
      });
      el.enableSection3.addEventListener("change", () => {
        toggleSection3();
        updateSectionCounts();
      });
      el.syllabusFile.addEventListener("change", importSyllabusFile);

      el.studentCourse.addEventListener("change", updateStudentPracticals);
      el.studentSemester.addEventListener("change", updateStudentPracticals);
      el.studentToken.addEventListener("input", () => {
        el.studentToken.value = el.studentToken.value.toUpperCase();
      });
      el.studentToken.addEventListener("blur", syncStudentByToken);
      el.studentContact.addEventListener("input", () => {
        el.studentContact.value = el.studentContact.value.replace(/\D/g, "").slice(0, 10);
      });
      document.getElementById("generatePaperBtn").addEventListener("click", registerAndGeneratePaper);
      el.changePaperBtn.addEventListener("click", changeQuestionPaper);
      el.downloadPdfBtn.addEventListener("click", downloadQuestionPaper);

      el.vivaToken.addEventListener("input", () => {
        el.vivaToken.value = el.vivaToken.value.replace(/\D/g, "").slice(0, VIVA_ACCESS_CODE_LENGTH);
      });
      document.getElementById("generateVivaBtn").addEventListener("click", generateViva);
    }

    function fillCourseOptions(select) {
      select.innerHTML = COURSES.map((course) => {
        return `<option value="${course.code}">${escapeHtml(course.name)}</option>`;
      }).join("");
    }

    function fillSemesterOptions(select) {
      select.innerHTML = SEMESTERS.map((semester) => {
        return `<option value="${semester}">Semester ${semester}</option>`;
      }).join("");
    }

    function fillCourseFilterOptions(select) {
      select.innerHTML = `<option value="">All courses</option>` + COURSES.map((course) => {
        return `<option value="${course.code}">${escapeHtml(course.name)}</option>`;
      }).join("");
    }

    function fillSemesterFilterOptions(select) {
      select.innerHTML = `<option value="">All semesters</option>` + SEMESTERS.map((semester) => {
        return `<option value="${semester}">Semester ${semester}</option>`;
      }).join("");
    }

    function switchTab(tabId) {
      if (!VALID_TABS.has(tabId)) {
        tabId = currentAdmin ? "dashboardView" : "adminView";
      }
      if (!currentAdmin && !PUBLIC_TABS.has(tabId)) {
        tabId = "adminView";
        setStatus(el.adminLoginStatus, "Login is required before accessing the examination dashboard.", "error");
      }
      const activeNavTab = tabId;
      document.querySelectorAll(".tab-button").forEach((button) => {
        button.classList.toggle("active", button.dataset.tab === activeNavTab);
      });
      document.querySelectorAll(".view").forEach((view) => {
        view.classList.toggle("active", view.id === tabId);
      });
      window.scrollTo({ top: 0, behavior: "smooth" });
      if (tabId === "recordsView") {
        renderRecords();
      }
      if (tabId === "coursesView") {
        renderCourses();
      }
      if (tabId === "semestersView") {
        renderSemesters();
      }
      if (tabId === "subjectsView") {
        renderSubjects();
      }
      if (tabId === "papersView") {
        renderQuestionPapers();
      }
    }

    function loadState() {
      return emptyState();
    }

    function emptyState() {
      return {
        admins: {},
        banks: {},
        subjects: {},
        attempts: {},
        vivaAttempts: {},
        activeTests: {}
      };
    }

    function normalizeFirebaseMap(value) {
      return value && typeof value === "object" && !Array.isArray(value) ? value : {};
    }

    function normalizeFirebaseState(value) {
      const data = normalizeFirebaseMap(value);
      return {
        admins: normalizeFirebaseMap(data.admins),
        banks: normalizeFirebaseMap(data.banks),
        subjects: normalizeFirebaseMap(data.subjects),
        attempts: normalizeFirebaseMap(data.attempts),
        vivaAttempts: normalizeFirebaseMap(data.vivaAttempts),
        activeTests: normalizeFirebaseMap(data.activeTests)
      };
    }

    function sanitizeForFirebase(value) {
      if (Array.isArray(value)) {
        return value.map(sanitizeForFirebase);
      }
      if (value && typeof value === "object") {
        return Object.entries(value).reduce((output, [key, item]) => {
          if (typeof item !== "undefined") {
            output[key] = sanitizeForFirebase(item);
          }
          return output;
        }, {});
      }
      return typeof value === "undefined" ? null : value;
    }

    function isFirebaseConfigured() {
      return Boolean(
        FIREBASE_CONFIG.apiKey
        && !FIREBASE_CONFIG.apiKey.startsWith("REPLACE_WITH")
        && FIREBASE_CONFIG.authDomain
        && !FIREBASE_CONFIG.authDomain.startsWith("REPLACE_WITH")
        && FIREBASE_CONFIG.databaseURL
        && !FIREBASE_CONFIG.databaseURL.includes("REPLACE_WITH")
        && FIREBASE_CONFIG.projectId
        && !FIREBASE_CONFIG.projectId.startsWith("REPLACE_WITH")
        && FIREBASE_CONFIG.appId
        && !FIREBASE_CONFIG.appId.startsWith("REPLACE_WITH")
      );
    }

    function initializeFirebase() {
      if (!isFirebaseConfigured()) {
        firebaseStatusMessage = "Firebase is not configured. Paste your web app config into FIREBASE_CONFIG in assets/app.js.";
        setStatus(el.adminLoginStatus, firebaseStatusMessage, "error");
        return;
      }
      if (!globalThis.firebase?.initializeApp) {
        firebaseStatusMessage = "Firebase SDK did not load. Check the script tags and Content Security Policy.";
        setStatus(el.adminLoginStatus, firebaseStatusMessage, "error");
        return;
      }
      try {
        const app = globalThis.firebase.apps?.length
          ? globalThis.firebase.app()
          : globalThis.firebase.initializeApp(FIREBASE_CONFIG);
        firebaseServices = {
          app,
          auth: globalThis.firebase.auth(),
          dataRef: globalThis.firebase.database().ref(FIREBASE_DATA_ROOT)
        };
        startPublicFirebaseSync();
        firebaseServices.auth.onAuthStateChanged(handleFirebaseAuthState);
      } catch (error) {
        firebaseStatusMessage = firebaseErrorMessage(error);
        setStatus(el.adminLoginStatus, firebaseStatusMessage, "error");
      }
    }

    function startPublicFirebaseSync() {
      attachFirebaseListener("banks", (value) => {
        state.banks = normalizeFirebaseMap(value);
        renderFromState();
      }, firebasePublicListeners);
      attachFirebaseListener("activeTests", (value) => {
        state.activeTests = normalizeFirebaseMap(value);
        renderFromState();
      }, firebasePublicListeners);
    }

    function startAdminFirebaseSync() {
      detachFirebaseListener(firebaseAdminListener);
      firebaseAdminListener = attachFirebaseListener("", (value) => {
        state = normalizeFirebaseState(value);
        refreshCurrentAdminFromState();
        ensureAccessCodeSchema();
        renderFromState();
      });
    }

    function attachFirebaseListener(path, callback, collection) {
      if (!firebaseServices?.dataRef) {
        return null;
      }
      const ref = path ? firebaseServices.dataRef.child(path) : firebaseServices.dataRef;
      const listener = (snapshot) => callback(snapshot.val());
      const errorHandler = (error) => {
        firebaseStatusMessage = firebaseErrorMessage(error);
        setStatus(el.adminLoginStatus, firebaseStatusMessage, "error");
      };
      ref.on("value", listener, errorHandler);
      const entry = { ref, listener };
      if (Array.isArray(collection)) {
        collection.push(entry);
      }
      return entry;
    }

    function detachFirebaseListener(entry) {
      if (entry?.ref && entry.listener) {
        entry.ref.off("value", entry.listener);
      }
    }

    function detachAdminFirebaseSync() {
      detachFirebaseListener(firebaseAdminListener);
      firebaseAdminListener = null;
    }

    function renderFromState() {
      updateAdminPracticalList();
      updateStudentPracticals();
      if (currentAdmin) {
        renderAdminBank();
      }
      renderAdminAuth();
      renderAllSummaries();
    }

    function saveState(statusTarget = el.adminStatus) {
      renderAllSummaries();
      if (!firebaseServices?.dataRef) {
        setStatus(statusTarget, firebaseStatusMessage || "Firebase is not ready.", "error");
        return Promise.resolve(false);
      }
      if (!requireAdmin()) {
        return Promise.resolve(false);
      }
      return firebaseServices.dataRef
        .set(sanitizeForFirebase(normalizeFirebaseState(state)))
        .then(() => true)
        .catch((error) => {
          setStatus(statusTarget, firebaseErrorMessage(error), "error");
          return false;
        });
    }

    function writeFirebaseChild(path, value, statusTarget) {
      if (!firebaseServices?.dataRef) {
        setStatus(statusTarget, firebaseStatusMessage || "Firebase is not ready.", "error");
        return Promise.resolve(false);
      }
      return firebaseServices.dataRef
        .child(path)
        .set(sanitizeForFirebase(value))
        .then(() => true)
        .catch((error) => {
          setStatus(statusTarget, firebaseErrorMessage(error), "error");
          return false;
        });
    }

    function saveAttempt(attemptKey) {
      renderAllSummaries();
      return writeFirebaseChild(`attempts/${attemptKey}`, state.attempts[attemptKey], el.studentStatus);
    }

    function saveVivaAttempt(vivaKey) {
      renderAllSummaries();
      return writeFirebaseChild(`vivaAttempts/${vivaKey}`, state.vivaAttempts[vivaKey], el.vivaStatus);
    }

    function ensureAccessCodeSchema() {
      let changed = false;
      Object.values(state.banks || {}).forEach((bank) => {
        if (!bank?.finalized) {
          return;
        }
        if (!Object.prototype.hasOwnProperty.call(bank, "vivaTokens")) {
          bank.vivaTokens = generateVivaTokens();
          changed = true;
        }
        const activeTest = state.activeTests?.[bank.id];
        if (activeTest && !Object.prototype.hasOwnProperty.call(activeTest, "vivaTokens")) {
          activeTest.vivaTokens = (bank.vivaTokens || []).slice();
          changed = true;
        }
      });
      if (changed && currentAdmin) {
        saveState();
      }
    }

    function buildAdminProfile(user, record = {}) {
      return {
        uid: user.uid,
        name: record.name || user.displayName || user.email || "Firebase Admin",
        email: record.email || user.email || "",
        username: record.email || user.email || user.uid,
        role: record.role || "admin"
      };
    }

    function refreshCurrentAdminFromState() {
      const user = firebaseServices?.auth?.currentUser;
      if (!user || !currentAdmin) {
        return;
      }
      const record = state.admins?.[user.uid];
      if (!record) {
        currentAdmin = null;
        detachAdminFirebaseSync();
        firebaseServices.auth.signOut();
        setStatus(el.adminLoginStatus, "This Firebase user no longer has admin access.", "error");
        return;
      }
      currentAdmin = buildAdminProfile(user, record);
    }

    async function handleFirebaseAuthState(user) {
      detachAdminFirebaseSync();
      if (!user) {
        currentAdmin = null;
        renderAdminAuth();
        renderAllSummaries();
        return;
      }
      try {
        const adminSnapshot = await firebaseServices.dataRef.child(`admins/${user.uid}`).once("value");
        const adminRecord = adminSnapshot.val();
        if (!adminRecord || adminRecord.disabled) {
          currentAdmin = null;
          renderAdminAuth();
          renderAllSummaries();
          await firebaseServices.auth.signOut();
          setStatus(el.adminLoginStatus, "Firebase sign-in succeeded, but this user is not listed as an exam admin.", "error");
          return;
        }
        currentAdmin = buildAdminProfile(user, adminRecord);
        startAdminFirebaseSync();
        renderAdminAuth();
        renderAllSummaries();
        switchTab("dashboardView");
        setStatus(el.adminLoginStatus, "Firebase admin login successful. Data is syncing.", "ok");
      } catch (error) {
        currentAdmin = null;
        renderAdminAuth();
        renderAllSummaries();
        setStatus(el.adminLoginStatus, firebaseErrorMessage(error), "error");
      }
    }

    function requireAdmin() {
      const user = firebaseServices?.auth?.currentUser;
      if (currentAdmin && user && currentAdmin.uid === user.uid) {
        return true;
      }
      setStatus(el.adminLoginStatus, "Firebase admin login is required for this action.", "error");
      renderAdminAuth();
      switchTab("adminView");
      return false;
    }

    function renderAdminAuth() {
      const loggedIn = Boolean(currentAdmin);
      document.querySelectorAll(".tab-button[data-tab]").forEach((button) => {
        const locked = !loggedIn && !PUBLIC_TABS.has(button.dataset.tab);
        button.disabled = locked;
        button.setAttribute("aria-disabled", locked ? "true" : "false");
      });
      el.adminLoginPanel.classList.toggle("hidden", loggedIn);
      el.adminDashboard.classList.toggle("hidden", !loggedIn);
      if (loggedIn) {
        el.currentAdminName.textContent = `${currentAdmin.name} (${currentAdmin.email || currentAdmin.uid})`;
        if (el.headerAdminName) {
          el.headerAdminName.textContent = currentAdmin.name || currentAdmin.email || currentAdmin.uid;
        }
        if (el.adminSessionBadge.textContent === "Locked") {
          el.adminSessionBadge.textContent = "Firebase";
        }
      } else {
        if (el.headerAdminName) {
          el.headerAdminName.textContent = "Login required";
        }
        el.adminSessionBadge.textContent = "Locked";
        el.adminLoginTitle.textContent = "Admin Login";
        el.adminLoginHelp.textContent = "Use the Firebase administrator email and password configured for this exam portal.";
        el.adminLoginBtnText.textContent = "Login";
      }
      renderAdminList();
    }

    async function loginAdmin() {
      const email = el.adminLoginUsername.value.trim();
      const password = el.adminLoginPassword.value;
      if (!firebaseServices?.auth) {
        setStatus(el.adminLoginStatus, firebaseStatusMessage || "Firebase is not ready.", "error");
        return;
      }
      if (!email || !password) {
        setStatus(el.adminLoginStatus, "Enter Firebase admin email and password.", "error");
        return;
      }
      try {
        setStatus(el.adminLoginStatus, "Signing in with Firebase...", "ok");
        await firebaseServices.auth.signInWithEmailAndPassword(email, password);
        el.adminLoginPassword.value = "";
      } catch (error) {
        setStatus(el.adminLoginStatus, firebaseErrorMessage(error), "error");
      }
    }

    async function logoutAdmin() {
      if (firebaseServices?.auth) {
        await firebaseServices.auth.signOut();
      }
      currentAdmin = null;
      detachAdminFirebaseSync();
      el.adminLoginUsername.value = "";
      el.adminLoginPassword.value = "";
      renderAdminAuth();
      renderAllSummaries();
      switchTab("adminView");
      setStatus(el.adminLoginStatus, "Firebase admin logged out.", "ok");
    }

    async function addNewAdmin() {
      if (!requireAdmin()) {
        return;
      }
      const name = el.newAdminName.value.trim();
      const uid = el.newAdminUsername.value.trim();
      const email = el.newAdminPassword.value.trim();
      if (!name || !uid || !email) {
        setStatus(el.newAdminStatus, "Enter admin name, Firebase UID, and email.", "error");
        return;
      }
      if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
        setStatus(el.newAdminStatus, "Enter a valid Firebase Auth email address.", "error");
        return;
      }
      if (state.admins?.[uid]) {
        setStatus(el.newAdminStatus, "This Firebase UID is already an admin.", "error");
        return;
      }
      state.admins[uid] = {
        uid,
        name,
        email,
        role: "admin",
        createdAt: new Date().toISOString(),
        createdBy: currentAdmin.uid
      };
      el.newAdminName.value = "";
      el.newAdminUsername.value = "";
      el.newAdminPassword.value = "";
      const saved = await saveState(el.newAdminStatus);
      if (!saved) {
        return;
      }
      renderAdminList();
      setStatus(el.newAdminStatus, "Admin access saved. Make sure this UID exists in Firebase Authentication.", "ok");
    }

    function fillRandom(target) {
      if (!globalThis.crypto?.getRandomValues) {
        throw new Error("Secure random number generation is unavailable in this browser.");
      }
      globalThis.crypto.getRandomValues(target);
    }

    function secureRandomInt(maxExclusive) {
      if (!Number.isInteger(maxExclusive) || maxExclusive <= 0) {
        return 0;
      }
      const range = 0x100000000;
      const limit = Math.floor(range / maxExclusive) * maxExclusive;
      const values = new Uint32Array(1);
      do {
        fillRandom(values);
      } while (values[0] >= limit);
      return values[0] % maxExclusive;
    }

    function firebaseErrorMessage(error) {
      if (error?.code === "auth/unauthorized-domain") {
        return "Firebase Auth is blocking this website domain. Add arun200125.github.io in Firebase Authentication > Settings > Authorized domains. (auth/unauthorized-domain)";
      }
      const code = error?.code ? ` (${error.code})` : "";
      const message = error?.message || "Firebase request failed.";
      return `${message}${code}`;
    }

    function renderAdminList() {
      if (!el.adminList) {
        return;
      }
      el.adminList.innerHTML = Object.values(state.admins || {}).map((admin) => {
        const current = currentAdmin?.uid === admin.uid ? "Current" : "Admin";
        return `<div class="admin-chip"><strong>${escapeHtml(admin.name)}</strong><span>${escapeHtml(admin.email || admin.uid)} | ${current}</span></div>`;
      }).join("");
    }

    function bankId(course, semester, practical) {
      return `${course}::${semester}::${slug(practical)}`;
    }

    function slug(value) {
      return String(value || "")
        .trim()
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, "-")
        .replace(/^-+|-+$/g, "") || "untitled";
    }

    function courseName(code) {
      const course = COURSES.find((item) => item.code === code);
      return course ? course.name : code;
    }

    function allSubjects() {
      return Object.values(state.subjects || {});
    }

    function allBanks() {
      return Object.values(state.banks || {});
    }

    function subjectId(course, semester, code) {
      return `${course}::${semester}::${slug(code)}`;
    }

    function subjectsFor(course, semester) {
      return allSubjects().filter((subject) => {
        return subject.course === course && (!semester || subject.semester === semester);
      });
    }

    function banksFor(course, semester) {
      return allBanks().filter((bank) => {
        return bank.course === course && (!semester || bank.semester === semester);
      });
    }

    function attemptsFor(course, semester) {
      return Object.values(state.attempts || {}).filter((attempt) => {
        return attempt.details?.course === course && (!semester || attempt.details?.semester === semester);
      });
    }

    function activeTestsFor(course, semester) {
      return activeTests().filter((test) => {
        const bank = state.banks[test.bankId] || test;
        return bank.course === course && (!semester || bank.semester === semester);
      });
    }

    function emptyTableRow(colspan, message) {
      return `<tr><td class="empty-row" colspan="${colspan}">${escapeHtml(message)}</td></tr>`;
    }

    function renderCourses() {
      const cards = COURSES.map((course) => {
        const subjects = subjectsFor(course.code);
        const banks = banksFor(course.code);
        const active = activeTestsFor(course.code);
        const papers = attemptsFor(course.code);
        const theoryCount = subjects.filter((subject) => subject.type === "THEORY").length;
        const practicalCount = subjects.filter((subject) => subject.type === "PRACTICAL").length;
        return `
          <article class="entity-card">
            <header>
              <div>
                <h3>${escapeHtml(course.name)}</h3>
                <p>${escapeHtml(course.code)} | Six semester undergraduate course</p>
              </div>
              <span class="status-chip live">Active</span>
            </header>
            <div class="mini-stat-grid">
              <div class="mini-stat"><span>Semesters</span><strong>${SEMESTERS.length}</strong></div>
              <div class="mini-stat"><span>Theory</span><strong>${theoryCount}</strong></div>
              <div class="mini-stat"><span>Practical</span><strong>${practicalCount}</strong></div>
              <div class="mini-stat"><span>Banks</span><strong>${banks.length}</strong></div>
              <div class="mini-stat"><span>Active Tests</span><strong>${active.length}</strong></div>
              <div class="mini-stat"><span>Papers</span><strong>${papers.length}</strong></div>
            </div>
            <div class="row-actions">
              <button class="btn" type="button" data-action="view-semesters" data-course="${escapeHtml(course.code)}">Semesters</button>
              <button class="btn primary" type="button" data-action="manage-subjects" data-course="${escapeHtml(course.code)}">Subjects</button>
            </div>
          </article>
        `;
      }).join("");
      el.courseCards.innerHTML = cards;
    }

    function handleCourseCardAction(event) {
      const button = event.target.closest("[data-action]");
      if (!button) {
        return;
      }
      const course = button.dataset.course || "";
      if (button.dataset.action === "view-semesters") {
        el.semesterCourseFilter.value = course;
        switchTab("semestersView");
      }
      if (button.dataset.action === "manage-subjects") {
        el.subjectFilterCourse.value = course;
        el.subjectCourse.value = course;
        switchTab("subjectsView");
      }
    }

    function renderSemesters() {
      const selectedCourse = el.semesterCourseFilter.value;
      const courses = selectedCourse ? COURSES.filter((course) => course.code === selectedCourse) : COURSES;
      const rows = [];
      courses.forEach((course) => {
        SEMESTERS.forEach((semester) => {
          const subjects = subjectsFor(course.code, semester);
          const banks = banksFor(course.code, semester);
          const active = activeTestsFor(course.code, semester);
          const theoryCount = subjects.filter((subject) => subject.type === "THEORY").length;
          const practicalCount = subjects.filter((subject) => subject.type === "PRACTICAL").length;
          rows.push(`
            <tr>
              <td><strong>${escapeHtml(course.name)}</strong><span>${escapeHtml(course.code)}</span></td>
              <td><strong>Semester ${escapeHtml(semester)}</strong><span>Academic level ${escapeHtml(semester)}</span></td>
              <td>${theoryCount}</td>
              <td>${practicalCount}</td>
              <td>${banks.length}</td>
              <td><span class="status-chip ${active.length ? "live" : "neutral"}">${active.length} active</span></td>
            </tr>
          `);
        });
      });
      el.semesterTableBody.innerHTML = rows.join("") || emptyTableRow(6, "No semesters found.");
    }

    async function saveSubject() {
      if (!requireAdmin()) {
        return;
      }
      const name = el.subjectName.value.trim();
      const code = (el.subjectCode.value.trim() || suggestSubjectCode(name)).toUpperCase();
      const course = el.subjectCourse.value;
      const semester = el.subjectSemester.value;
      const type = el.subjectType.value;
      const credits = positiveNumber(el.subjectCredits.value, 0);
      const marks = positiveNumber(el.subjectMarks.value, 100);
      const syllabus = el.subjectSyllabus.value.trim();

      if (!name || !code || !course || !semester || !type) {
        setStatus(el.subjectFormStatus, "Enter course, semester, subject name, code, and type.", "error");
        return;
      }

      const nextId = subjectId(course, semester, code);
      const existing = state.subjects[nextId];
      if (!editingSubjectId && existing) {
        setStatus(el.subjectFormStatus, "A subject with this code already exists for the selected course and semester.", "error");
        return;
      }
      if (editingSubjectId && editingSubjectId !== nextId && existing) {
        setStatus(el.subjectFormStatus, "Another subject already uses this code for the selected course and semester.", "error");
        return;
      }

      const previous = editingSubjectId ? state.subjects[editingSubjectId] : null;
      if (editingSubjectId && editingSubjectId !== nextId) {
        delete state.subjects[editingSubjectId];
      }

      state.subjects[nextId] = {
        ...(previous || {}),
        id: nextId,
        course,
        semester,
        name,
        code,
        type,
        credits,
        marks,
        syllabus,
        createdAt: previous?.createdAt || new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        updatedBy: currentAdmin.username
      };

      const saved = await saveState(el.subjectFormStatus);
      if (!saved) {
        return;
      }
      clearSubjectForm(false);
      setStatus(el.subjectFormStatus, "Subject saved successfully.", "ok");
    }

    function clearSubjectForm(showStatus) {
      editingSubjectId = "";
      el.subjectFormTitle.textContent = "Add Subject";
      el.subjectName.value = "";
      el.subjectCode.value = "";
      el.subjectType.value = "THEORY";
      el.subjectCredits.value = 3;
      el.subjectMarks.value = 100;
      el.subjectSyllabus.value = "";
      el.subjectFormStatus.textContent = "";
      el.subjectFormStatus.className = "status";
      if (showStatus) {
        setStatus(el.subjectFormStatus, "Subject form cleared.", "ok");
      }
    }

    function renderSubjects() {
      const course = el.subjectFilterCourse.value;
      const semester = el.subjectFilterSemester.value;
      const type = el.subjectFilterType.value;
      const subjects = allSubjects()
        .filter((subject) => !course || subject.course === course)
        .filter((subject) => !semester || subject.semester === semester)
        .filter((subject) => !type || subject.type === type)
        .sort((a, b) => {
          return `${a.course}${a.semester}${a.code}`.localeCompare(`${b.course}${b.semester}${b.code}`);
        });

      el.subjectTableBody.innerHTML = subjects.map((subject) => `
        <tr>
          <td><strong>${escapeHtml(subject.name)}</strong><span>${escapeHtml(subject.code)} | ${escapeHtml(subject.credits)} credits</span></td>
          <td>${escapeHtml(courseName(subject.course))}</td>
          <td>Semester ${escapeHtml(subject.semester)}</td>
          <td><span class="status-chip ${subject.type === "PRACTICAL" ? "live" : "neutral"}">${escapeHtml(subjectTypeLabel(subject.type))}</span></td>
          <td>${escapeHtml(subject.marks)}</td>
          <td>
            <div class="table-actions">
              <button class="icon-btn" type="button" data-action="edit-subject" data-id="${escapeHtml(subject.id)}" title="Edit subject" aria-label="Edit ${escapeHtml(subject.name)}">
                <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" aria-hidden="true"><path d="M12 20h9"></path><path d="M16.5 3.5a2.1 2.1 0 0 1 3 3L7 19l-4 1 1-4 12.5-12.5z"></path></svg>
              </button>
              <button class="icon-btn" type="button" data-action="delete-subject" data-id="${escapeHtml(subject.id)}" title="Delete subject" aria-label="Delete ${escapeHtml(subject.name)}">
                <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" aria-hidden="true"><path d="M3 6h18"></path><path d="M8 6V4h8v2"></path><path d="M19 6l-1 15H6L5 6"></path><path d="M10 11v6"></path><path d="M14 11v6"></path></svg>
              </button>
            </div>
          </td>
        </tr>
      `).join("") || emptyTableRow(6, "No subjects match the current filters.");
    }

    function handleSubjectTableAction(event) {
      const button = event.target.closest("[data-action]");
      if (!button) {
        return;
      }
      const subject = state.subjects[button.dataset.id];
      if (!subject) {
        return;
      }
      if (button.dataset.action === "edit-subject") {
        editSubject(subject);
      }
      if (button.dataset.action === "delete-subject") {
        deleteSubject(subject);
      }
    }

    function editSubject(subject) {
      if (!requireAdmin()) {
        return;
      }
      editingSubjectId = subject.id;
      el.subjectFormTitle.textContent = "Edit Subject";
      el.subjectCourse.value = subject.course;
      el.subjectSemester.value = subject.semester;
      el.subjectName.value = subject.name;
      el.subjectCode.value = subject.code;
      el.subjectType.value = subject.type;
      el.subjectCredits.value = subject.credits;
      el.subjectMarks.value = subject.marks;
      el.subjectSyllabus.value = subject.syllabus || "";
      setStatus(el.subjectFormStatus, "Editing selected subject.", "ok");
      window.scrollTo({ top: 0, behavior: "smooth" });
    }

    async function deleteSubject(subject) {
      if (!requireAdmin()) {
        return;
      }
      const confirmed = window.confirm(`Delete ${subject.name}? This removes the subject from the synced catalog.`);
      if (!confirmed) {
        return;
      }
      delete state.subjects[subject.id];
      if (editingSubjectId === subject.id) {
        clearSubjectForm(false);
      }
      const saved = await saveState(el.subjectFormStatus);
      if (!saved) {
        return;
      }
      setStatus(el.subjectFormStatus, "Subject deleted.", "ok");
    }

    function subjectTypeLabel(type) {
      return type === "PRACTICAL" ? "Practical" : "Theory";
    }

    function suggestSubjectCode(value) {
      const words = String(value || "").trim().split(/\s+/).filter(Boolean);
      if (!words.length) {
        return "";
      }
      const prefix = words.map((word) => word[0]).join("").slice(0, 4).toUpperCase();
      return `${prefix}${100 + secureRandomInt(900)}`;
    }

    function practicalSubjectCode(bank) {
      const prefix = String(bank.practical || "")
        .split(/\s+/)
        .filter(Boolean)
        .map((word) => word[0])
        .join("")
        .slice(0, 5)
        .toUpperCase() || "PRAC";
      return `${bank.course}${bank.semester}-${prefix}`;
    }

    function upsertSubjectFromBank(bank) {
      if (!bank?.practical) {
        return;
      }
      if (!state.subjects || typeof state.subjects !== "object") {
        state.subjects = {};
      }
      const code = practicalSubjectCode(bank);
      const id = subjectId(bank.course, bank.semester, code);
      const previous = state.subjects[id] || {};
      state.subjects[id] = {
        ...previous,
        id,
        course: bank.course,
        semester: bank.semester,
        name: bank.practical,
        code,
        type: "PRACTICAL",
        credits: previous.credits || 2,
        marks: previous.marks || 100,
        syllabus: bank.syllabus || previous.syllabus || "",
        createdAt: previous.createdAt || new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        updatedBy: currentAdmin?.username || "admin"
      };
    }

    function renderQuestionPapers() {
      const banks = allBanks().sort((a, b) => (b.updatedAt || "").localeCompare(a.updatedAt || ""));
      const generated = Object.values(state.attempts || {}).sort((a, b) => (b.updatedAt || "").localeCompare(a.updatedAt || ""));
      const activeCount = activeTests().length;

      el.paperBankCount.textContent = banks.length;
      el.paperActiveCount.textContent = activeCount;
      el.paperGeneratedCount.textContent = generated.length;

      el.paperBankTableBody.innerHTML = banks.map((bank) => {
        const counts = activeSectionIds(bank).map((id) => `${moduleShortLabel(id)}: ${bank.sections[id]?.questions.length || 0}`).join(" | ");
        const status = selectedBankStateLabel(bank);
        const statusClass = isBankActive(bank) ? "live" : bank.finalized ? "warning" : "neutral";
        return `
          <tr>
            <td><strong>${escapeHtml(bank.practical)}</strong><span>Updated ${escapeHtml(formatDateTime(bank.updatedAt))}</span></td>
            <td>${escapeHtml(courseName(bank.course))}</td>
            <td>Semester ${escapeHtml(bank.semester)}</td>
            <td>${escapeHtml(counts || "No modules")}</td>
            <td>Paper: ${(bank.tokens || []).length}<span>Viva: ${(bank.vivaTokens || []).length}</span></td>
            <td><span class="status-chip ${statusClass}">${escapeHtml(status)}</span></td>
          </tr>
        `;
      }).join("") || emptyTableRow(6, "No practical question banks have been created yet.");

      el.generatedPaperTableBody.innerHTML = generated.map((attempt) => `
        <tr>
          <td><strong>${escapeHtml(attempt.details?.fullName || "Unknown student")}</strong><span>${escapeHtml(attempt.details?.rollNo || "No roll number")}</span></td>
          <td>${escapeHtml(attempt.details?.practical || "Unknown practical")}</td>
          <td>${escapeHtml(attempt.details?.token || "No Access Code")}</td>
          <td>${escapeHtml(paperVersionLabel(attempt))}</td>
          <td><span class="status-chip ${attempt.downloadedAt ? "live" : "warning"}">${escapeHtml(downloadStatusLabel(attempt))}</span></td>
        </tr>
      `).join("") || emptyTableRow(5, "Generated paper records will appear here.");
    }

    function getAdminId() {
      return bankId(el.adminCourse.value, el.adminSemester.value, el.adminPracticalName.value);
    }

    function updateAdminPracticalList() {
      const course = el.adminCourse.value;
      const semester = el.adminSemester.value;
      const practicals = Object.values(state.banks)
        .filter((bank) => bank.course === course && bank.semester === semester)
        .map((bank) => bank.practical)
        .sort((a, b) => a.localeCompare(b));
      el.adminPracticalList.innerHTML = practicals.map((name) => `<option value="${escapeHtml(name)}"></option>`).join("");
    }

    function getBank(course, semester, practical) {
      return state.banks[bankId(course, semester, practical)] || null;
    }

    function renderAdminBank() {
      const practical = el.adminPracticalName.value.trim();
      const existing = practical ? getBank(el.adminCourse.value, el.adminSemester.value, practical) : null;
      accessCodesVisible = false;

      if (!existing) {
        el.section1Target.value = 5;
        el.section2Target.value = 5;
        el.section3Target.value = 5;
        adminQuestions = { "1": [], "2": [], "3": [] };
        el.section1QuestionInput.value = "";
        el.section2QuestionInput.value = "";
        el.section3QuestionInput.value = "";
        el.enableSection3.checked = false;
        el.vivaSyllabus.value = "";
        toggleSection3();
        renderTokens([], []);
        renderTestControls(null);
        el.adminSessionBadge.textContent = currentAdmin ? "Draft" : "Locked";
        renderAdminQuestionLists();
        updateSectionCounts();
        return;
      }

      el.section1Target.value = existing.sections["1"]?.target || 5;
      el.section2Target.value = existing.sections["2"]?.target || 5;
      el.section3Target.value = existing.sections["3"]?.target || 5;
      adminQuestions = {
        "1": normalizeQuestions(existing.sections["1"]?.questions || []),
        "2": normalizeQuestions(existing.sections["2"]?.questions || []),
        "3": normalizeQuestions(existing.sections["3"]?.questions || [])
      };
      el.section1QuestionInput.value = "";
      el.section2QuestionInput.value = "";
      el.section3QuestionInput.value = "";
      el.enableSection3.checked = Boolean(existing.section3Enabled);
      el.vivaSyllabus.value = existing.syllabus || "";
      toggleSection3();
      renderTokens(existing.tokens || [], existing.vivaTokens || []);
      renderTestControls(existing);
      el.adminSessionBadge.textContent = currentAdmin ? selectedBankStateLabel(existing) : "Locked";
      renderAdminQuestionLists();
      updateSectionCounts();
    }

    function toggleSection3() {
      const enabled = el.enableSection3.checked;
      el.section3Target.disabled = !enabled;
      el.section3QuestionInput.disabled = !enabled;
      el.addSection3Question.disabled = !enabled;
      if (!enabled) {
        adminQuestions["3"] = [];
        el.section3QuestionInput.value = "";
      }
      renderAdminQuestionLists();
      updateSectionCounts();
    }

    function normalizeQuestions(value) {
      if (Array.isArray(value)) {
        return value.map((question) => String(question || "").trim()).filter(Boolean);
      }
      return parseQuestions(value);
    }

    function moduleLabel(sectionId) {
      return `Module ${sectionId}`;
    }

    function moduleShortLabel(sectionId) {
      return `M${sectionId}`;
    }

    function updateSectionCounts() {
      updateSectionCount("1");
      updateSectionCount("2");
      updateSectionCount("3");
    }

    function updateSectionCount(sectionId) {
      const count = adminQuestions[sectionId]?.length || 0;
      const target = getSectionTarget(sectionId);
      const progress = target ? Math.min(100, Math.round((count / target) * 100)) : 0;
      sectionProgress(sectionId).value = progress;
      if (sectionId === "3" && !el.enableSection3.checked) {
        el.section3Count.textContent = "Module 3 disabled";
        sectionProgress(sectionId).value = 0;
        return;
      }
      const label = count === target
        ? `${count} of ${target} questions added. ${moduleLabel(sectionId)} ready.`
        : `${count} of ${target} questions added`;
      sectionCount(sectionId).textContent = label;
      const addButton = sectionAddButton(sectionId);
      addButton.disabled = (sectionId === "3" && !el.enableSection3.checked) || count >= target;
    }

    function renderAdminQuestionLists() {
      SECTION_IDS.forEach((sectionId) => {
        const list = sectionList(sectionId);
        const questions = adminQuestions[sectionId] || [];
        if (!questions.length) {
          list.innerHTML = `<p class="help">No questions added yet.</p>`;
          return;
        }
        list.innerHTML = questions.map((question, index) => `
          <div class="question-row">
            <p>${escapeHtml(question)}</p>
            <button class="icon-btn" type="button" data-action="remove-question" data-section="${sectionId}" data-index="${index}" title="Remove question" aria-label="Remove question ${index + 1} from ${moduleLabel(sectionId)}">
              <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" aria-hidden="true"><path d="M18 6L6 18"></path><path d="M6 6l12 12"></path></svg>
            </button>
          </div>
        `).join("");
      });
    }

    function handleQuestionListAction(event) {
      const button = event.target.closest("[data-action='remove-question']");
      if (!button) {
        return;
      }
      if (!requireAdmin()) {
        return;
      }
      const sectionId = button.dataset.section;
      const index = Number.parseInt(button.dataset.index, 10);
      if (Number.isInteger(index) && adminQuestions[sectionId]) {
        adminQuestions[sectionId].splice(index, 1);
        renderAdminQuestionLists();
        updateSectionCounts();
      }
    }

    function addSectionQuestion(sectionId) {
      if (!requireAdmin()) {
        return;
      }
      if (sectionId === "3" && !el.enableSection3.checked) {
        setStatus(el.adminStatus, "Enable Module 3 before adding Module 3 questions.", "error");
        return;
      }
      const input = sectionInput(sectionId);
      const question = input.value.trim();
      const target = getSectionTarget(sectionId);
      const count = adminQuestions[sectionId]?.length || 0;
      if (!question) {
        setStatus(el.adminStatus, `Type one question for ${moduleLabel(sectionId)}.`, "error");
        return;
      }
      if (count >= target) {
        setStatus(el.adminStatus, `${moduleLabel(sectionId)} already has ${target} questions. Increase n or remove a question first.`, "error");
        return;
      }
      adminQuestions[sectionId].push(question);
      input.value = "";
      renderAdminQuestionLists();
      updateSectionCounts();
      setStatus(el.adminStatus, `Question ${adminQuestions[sectionId].length} added to ${moduleLabel(sectionId)}.`, "ok");
    }

    function getSectionTarget(sectionId) {
      return positiveNumber(sectionTarget(sectionId).value, 1);
    }

    function sectionTarget(sectionId) {
      return sectionId === "1" ? el.section1Target : sectionId === "2" ? el.section2Target : el.section3Target;
    }

    function sectionInput(sectionId) {
      return sectionId === "1" ? el.section1QuestionInput : sectionId === "2" ? el.section2QuestionInput : el.section3QuestionInput;
    }

    function sectionList(sectionId) {
      return sectionId === "1" ? el.section1List : sectionId === "2" ? el.section2List : el.section3List;
    }

    function sectionCount(sectionId) {
      return sectionId === "1" ? el.section1Count : sectionId === "2" ? el.section2Count : el.section3Count;
    }

    function sectionProgress(sectionId) {
      return sectionId === "1" ? el.section1Progress : sectionId === "2" ? el.section2Progress : el.section3Progress;
    }

    function sectionAddButton(sectionId) {
      return sectionId === "1" ? el.addSection1Question : sectionId === "2" ? el.addSection2Question : el.addSection3Question;
    }

    function parseQuestions(value) {
      if (Array.isArray(value)) {
        return normalizeQuestions(value);
      }
      return String(value || "")
        .split(/\r?\n/)
        .map((line) => line.replace(/^\s*(?:[-*]|\d+[.)])\s*/, "").trim())
        .filter(Boolean);
    }

    function collectAdminBank() {
      const practical = el.adminPracticalName.value.trim();
      const existing = practical ? getBank(el.adminCourse.value, el.adminSemester.value, practical) : null;
      return {
        id: bankId(el.adminCourse.value, el.adminSemester.value, practical),
        course: el.adminCourse.value,
        semester: el.adminSemester.value,
        practical,
        section3Enabled: el.enableSection3.checked,
        sections: {
          "1": {
            target: positiveNumber(el.section1Target.value, 1),
            questions: normalizeQuestions(adminQuestions["1"])
          },
          "2": {
            target: positiveNumber(el.section2Target.value, 1),
            questions: normalizeQuestions(adminQuestions["2"])
          },
          "3": {
            target: el.enableSection3.checked ? positiveNumber(el.section3Target.value, 1) : 0,
            questions: el.enableSection3.checked ? normalizeQuestions(adminQuestions["3"]) : []
          }
        },
        syllabus: el.vivaSyllabus.value.trim(),
        tokens: existing?.tokens || [],
        vivaTokens: existing?.vivaTokens || [],
        finalized: existing?.finalized || false,
        updatedAt: new Date().toISOString()
      };
    }

    function positiveNumber(value, fallback) {
      const parsed = Number.parseInt(value, 10);
      return Number.isFinite(parsed) && parsed > 0 ? parsed : fallback;
    }

    function validateBankForFinalize(bank) {
      if (!bank.practical) {
        return "Enter a practical subject name.";
      }
      const required = activeSectionIds(bank);
      for (const sectionId of required) {
        const section = bank.sections[sectionId];
        if (!section.questions.length) {
          return `Add at least 1 question in ${moduleLabel(sectionId)}.`;
        }
        if (section.questions.length !== section.target) {
          return `${moduleLabel(sectionId)} needs exactly ${section.target} questions. Current count is ${section.questions.length}.`;
        }
      }
      return "";
    }

    function activeSectionIds(bank) {
      const ids = ["1", "2"];
      if (bank.section3Enabled) {
        ids.push("3");
      }
      return ids;
    }

    async function saveAdminDraft() {
      if (!requireAdmin()) {
        return;
      }
      const bank = collectAdminBank();
      if (!bank.practical) {
        setStatus(el.adminStatus, "Enter a practical subject name before saving.", "error");
        return;
      }
      state.banks[bank.id] = bank;
      upsertSubjectFromBank(bank);
      const saved = await saveState(el.adminStatus);
      if (!saved) {
        return;
      }
      updateAdminPracticalList();
      updateStudentPracticals();
      renderAdminBank();
      setStatus(el.adminStatus, "Question bank draft saved.", "ok");
    }

    async function finalizeSession() {
      if (!requireAdmin()) {
        return;
      }
      const bank = collectAdminBank();
      const error = validateBankForFinalize(bank);
      if (error) {
        setStatus(el.adminStatus, error, "error");
        return;
      }
      bank.finalized = true;
      ensureBankAccessCodes(bank);
      state.banks[bank.id] = bank;
      upsertSubjectFromBank(bank);
      const saved = await saveState(el.adminStatus);
      if (!saved) {
        return;
      }
      updateAdminPracticalList();
      updateStudentPracticals();
      renderAdminBank();
      setStatus(el.adminStatus, "Session finalized. Five Question Paper codes and ten Viva codes are ready. Click Activate Test when students should start.", "ok");
    }

    function selectedBankStateLabel(bank) {
      if (!bank) {
        return "Draft";
      }
      if (isBankActive(bank)) {
        return "Active";
      }
      return bank.finalized ? "Finalized" : "Draft";
    }

    function isBankActive(bank) {
      return Boolean(bank?.id && state.activeTests?.[bank.id]);
    }

    function activeTestForBank(bank) {
      return bank?.id ? state.activeTests?.[bank.id] || null : null;
    }

    function activeTests() {
      return Object.values(state.activeTests || {});
    }

    async function activateSelectedTest() {
      if (!requireAdmin()) {
        return;
      }
      const bank = getBank(el.adminCourse.value, el.adminSemester.value, el.adminPracticalName.value);
      if (!bank || !bank.finalized) {
        setStatus(el.adminStatus, "Finalize and generate Access Codes before activating this test.", "error");
        return;
      }
      ensureBankAccessCodes(bank);
      if (!Array.isArray(bank.tokens) || !bank.tokens.length) {
        setStatus(el.adminStatus, "Generate Access Codes before activating this test.", "error");
        return;
      }
      if (!Array.isArray(bank.vivaTokens) || !bank.vivaTokens.length) {
        setStatus(el.adminStatus, "Generate Viva Access Codes before activating this test.", "error");
        return;
      }
      state.banks[bank.id] = bank;
      state.activeTests[bank.id] = {
        bankId: bank.id,
        course: bank.course,
        semester: bank.semester,
        practical: bank.practical,
        tokens: bank.tokens.slice(),
        vivaTokens: bank.vivaTokens.slice(),
        activatedAt: new Date().toISOString(),
        activatedBy: currentAdmin.username
      };
      const saved = await saveState(el.adminStatus);
      if (!saved) {
        return;
      }
      updateStudentPracticals();
      renderAdminBank();
      setStatus(el.adminStatus, "Test activated. Students can now use these Access Codes.", "ok");
    }

    async function deleteActiveTest(bankId) {
      if (!requireAdmin()) {
        return;
      }
      const test = state.activeTests?.[bankId];
      if (!test) {
        setStatus(el.adminStatus, "No active test is selected for deletion.", "error");
        return;
      }
      const confirmed = window.confirm(`Delete active test for ${test.practical}? Student paper and viva generation will stop for these Access Codes.`);
      if (!confirmed) {
        return;
      }
      delete state.activeTests[bankId];
      const saved = await saveState(el.adminStatus);
      if (!saved) {
        return;
      }
      updateStudentPracticals();
      renderAdminBank();
      setStatus(el.adminStatus, "Active test deleted. The question bank remains saved.", "ok");
    }

    function handleActiveTestAction(event) {
      const button = event.target.closest("[data-action='delete-active-test']");
      if (!button) {
        return;
      }
      deleteActiveTest(button.dataset.bankId);
    }

    function renderTestControls(bank) {
      const activeTest = activeTestForBank(bank);
      const finalized = Boolean(bank?.finalized);
      el.testState.classList.toggle("live", Boolean(activeTest));
      el.activateTestBtn.disabled = !finalized || Boolean(activeTest);
      el.deleteActiveTestBtn.disabled = !activeTest;

      if (activeTest) {
        const paperCount = (activeTest.tokens || []).length;
        const vivaCount = (activeTest.vivaTokens || []).length;
        el.testStateTitle.textContent = "Test active";
        el.testStateMeta.textContent = `${bank.practical} is live with ${paperCount} Question Paper codes and ${vivaCount} Viva codes. Activated ${formatDateTime(activeTest.activatedAt)} by ${activeTest.activatedBy}.`;
        return;
      }
      if (finalized) {
        el.testStateTitle.textContent = "Ready to activate";
        el.testStateMeta.textContent = `${bank.practical} is finalized. Click Activate Test to allow Access Code entry.`;
        return;
      }
      el.testStateTitle.textContent = "No active test";
      el.testStateMeta.textContent = bank
        ? "Finalize and generate Access Codes before activation."
        : "Load or create a practical question bank first.";
    }

    function ensureBankAccessCodes(bank) {
      if (!Array.isArray(bank.tokens) || !bank.tokens.length) {
        bank.tokens = generateTokens(bank);
      }
      if (!Array.isArray(bank.vivaTokens) || !bank.vivaTokens.length) {
        bank.vivaTokens = generateVivaTokens();
      }
      return bank;
    }

    function generateTokens(bank) {
      const tokens = [];
      const subject = slug(bank.practical).slice(0, 3).toUpperCase().padEnd(3, "X");
      while (tokens.length < PAPER_ACCESS_CODE_COUNT) {
        const candidate = `${bank.course}-S${bank.semester}-${subject}-${randomChunk(6)}`;
        if (!tokenExists(candidate) && !tokens.includes(candidate)) {
          tokens.push(candidate);
        }
      }
      return tokens;
    }

    function generateVivaTokens() {
      const tokens = [];
      while (tokens.length < VIVA_ACCESS_CODE_COUNT) {
        const candidate = String((10 ** (VIVA_ACCESS_CODE_LENGTH - 1)) + secureRandomInt(9 * (10 ** (VIVA_ACCESS_CODE_LENGTH - 1))));
        if (!vivaTokenExists(candidate) && !tokens.includes(candidate)) {
          tokens.push(candidate);
        }
      }
      return tokens;
    }

    function randomChunk(length) {
      const alphabet = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";
      let output = "";
      for (let i = 0; i < length; i += 1) {
        output += alphabet[secureRandomInt(alphabet.length)];
      }
      return output;
    }

    function tokenExists(token) {
      return Object.values(state.banks).some((bank) => (bank.tokens || []).includes(token));
    }

    function vivaTokenExists(token) {
      return Object.values(state.banks).some((bank) => (bank.vivaTokens || []).includes(token));
    }

    function renderTokens(tokens, vivaTokens = []) {
      const paperTokens = Array.isArray(tokens) ? tokens : [];
      const vivaCodeList = Array.isArray(vivaTokens) ? vivaTokens : [];
      if (!paperTokens.length && !vivaCodeList.length) {
        el.tokenList.innerHTML = `<p class="help">No Access Codes generated yet.</p>`;
        el.viewAccessCodesBtn.disabled = true;
        el.viewAccessCodesBtn.setAttribute("aria-pressed", "false");
        el.viewAccessCodesText.textContent = "Show Access Codes";
        el.copyTokensBtn.disabled = true;
        return;
      }
      const paperHtml = paperTokens.length
        ? paperTokens.map((token, index) => tokenRow("paper", token, index, "Question Paper Code")).join("")
        : `<p class="help">No Question Paper codes available.</p>`;
      const vivaHtml = vivaCodeList.length
        ? vivaCodeList.map((token, index) => tokenRow("viva", token, index, "Viva Code")).join("")
        : `<p class="help">No Viva codes available.</p>`;
      el.tokenList.innerHTML = `
        <div class="token-group">
          <div class="token-group-title"><span>Question Paper Codes</span><span>${paperTokens.length}</span></div>
          ${paperHtml}
        </div>
        <div class="token-group">
          <div class="token-group-title"><span>Viva Codes</span><span>${vivaCodeList.length} x 4 digit</span></div>
          ${vivaHtml}
        </div>
      `;
      el.viewAccessCodesBtn.disabled = false;
      el.viewAccessCodesBtn.setAttribute("aria-pressed", accessCodesVisible ? "true" : "false");
      el.viewAccessCodesText.textContent = accessCodesVisible ? "Hide Access Codes" : "Show Access Codes";
      el.copyTokensBtn.disabled = false;
    }

    function tokenRow(type, token, index, labelPrefix) {
      const label = accessCodesVisible ? token : `${labelPrefix} ${index + 1} - hidden`;
      const title = type === "viva" ? "Delete Viva Access Code" : "Delete Question Paper Access Code";
      return `
        <div class="token ${accessCodesVisible ? "" : "masked"}">
          <span>${escapeHtml(label)}</span>
          <button class="icon-btn" type="button" data-action="delete-token" data-token-type="${type}" data-token="${escapeHtml(token)}" title="${title}" aria-label="${title}">
            <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" aria-hidden="true"><path d="M3 6h18"></path><path d="M8 6V4h8v2"></path><path d="M19 6l-1 15H6L5 6"></path><path d="M10 11v6"></path><path d="M14 11v6"></path></svg>
          </button>
        </div>
      `;
    }

    function toggleAccessCodeVisibility() {
      const bank = getBank(el.adminCourse.value, el.adminSemester.value, el.adminPracticalName.value);
      const tokens = bank?.tokens || [];
      const vivaTokens = bank?.vivaTokens || [];
      if (!tokens.length && !vivaTokens.length) {
        return;
      }
      accessCodesVisible = !accessCodesVisible;
      renderTokens(tokens, vivaTokens);
    }

    function copyTokens() {
      const bank = getBank(el.adminCourse.value, el.adminSemester.value, el.adminPracticalName.value);
      const tokens = bank?.tokens || [];
      const vivaTokens = bank?.vivaTokens || [];
      if (!tokens.length && !vivaTokens.length) {
        return;
      }
      const text = [
        "Question Paper Access Codes:",
        ...(tokens.length ? tokens : ["None"]),
        "",
        "Viva Access Codes:",
        ...(vivaTokens.length ? vivaTokens : ["None"])
      ].join("\n");
      if (navigator.clipboard?.writeText) {
        navigator.clipboard.writeText(text).then(() => {
          setStatus(el.adminStatus, "Access Codes copied.", "ok");
        }).catch(() => fallbackCopy(text));
      } else {
        fallbackCopy(text);
      }
    }

    function handleTokenListAction(event) {
      const button = event.target.closest("[data-action='delete-token']");
      if (!button) {
        return;
      }
      deleteAccessCode(button.dataset.tokenType, button.dataset.token);
    }

    async function deleteAccessCode(tokenType, token) {
      if (!requireAdmin()) {
        return;
      }
      const bank = getBank(el.adminCourse.value, el.adminSemester.value, el.adminPracticalName.value);
      if (!bank) {
        setStatus(el.adminStatus, "Load a practical question bank before deleting an Access Code.", "error");
        return;
      }
      const isVivaCode = tokenType === "viva";
      const key = isVivaCode ? "vivaTokens" : "tokens";
      const label = isVivaCode ? "Viva Access Code" : "Question Paper Access Code";
      if (!(bank[key] || []).includes(token)) {
        setStatus(el.adminStatus, `${label} was not found.`, "error");
        return;
      }
      const confirmed = window.confirm(`Delete ${label} ${token}? This code will stop working immediately.`);
      if (!confirmed) {
        return;
      }
      bank[key] = (bank[key] || []).filter((code) => code !== token);
      const activeTest = activeTestForBank(bank);
      if (activeTest) {
        activeTest[key] = (activeTest[key] || []).filter((code) => code !== token);
      }
      bank.updatedAt = new Date().toISOString();
      state.banks[bank.id] = bank;
      const saved = await saveState(el.adminStatus);
      if (!saved) {
        return;
      }
      renderAdminBank();
      setStatus(el.adminStatus, `${label} deleted. Deleted codes can no longer access the module.`, "ok");
    }

    function fallbackCopy(text) {
      const textarea = document.createElement("textarea");
      textarea.value = text;
      document.body.appendChild(textarea);
      textarea.select();
      document.execCommand("copy");
      textarea.remove();
      setStatus(el.adminStatus, "Access Codes copied.", "ok");
    }

    function importSyllabusFile(event) {
      const file = event.target.files[0];
      if (!file) {
        return;
      }
      const reader = new FileReader();
      reader.onload = () => {
        el.vivaSyllabus.value = String(reader.result || "");
        setStatus(el.adminStatus, "Syllabus uploaded into the viva syllabus field.", "ok");
      };
      reader.onerror = () => {
        setStatus(el.adminStatus, "Unable to read the syllabus file.", "error");
      };
      reader.readAsText(file);
    }

    function finalizedBanks() {
      return Object.values(state.banks).filter((bank) => bank.finalized);
    }

    function activeBanks() {
      return finalizedBanks().filter((bank) => isBankActive(bank));
    }

    function activeTokensForBank(bank) {
      return activeTestForBank(bank)?.tokens || [];
    }

    function activeVivaTokensForBank(bank) {
      return activeTestForBank(bank)?.vivaTokens || [];
    }

    function updateStudentPracticals() {
      const course = el.studentCourse.value;
      const semester = el.studentSemester.value;
      const banks = activeBanks()
        .filter((bank) => bank.course === course && bank.semester === semester)
        .sort((a, b) => a.practical.localeCompare(b.practical));

      if (!banks.length) {
        el.studentPractical.innerHTML = `<option value="">No active practical</option>`;
        return;
      }
      el.studentPractical.innerHTML = banks.map((bank) => {
        return `<option value="${escapeHtml(bank.practical)}">${escapeHtml(bank.practical)}</option>`;
      }).join("");
    }

    function syncStudentByToken() {
      const token = el.studentToken.value.trim().toUpperCase();
      if (!token) {
        return;
      }
      const match = findBankByToken(token);
      if (!match) {
        return;
      }
      el.studentCourse.value = match.course;
      el.studentSemester.value = match.semester;
      updateStudentPracticals();
      el.studentPractical.value = match.practical;
    }

    function findBankByToken(token) {
      const normalized = String(token || "").trim().toUpperCase();
      return activeBanks().find((bank) => activeTokensForBank(bank).includes(normalized)) || null;
    }

    function findAnyFinalizedBankByToken(token) {
      const normalized = String(token || "").trim().toUpperCase();
      return finalizedBanks().find((bank) => (bank.tokens || []).includes(normalized)) || null;
    }

    function findBankByVivaToken(token) {
      const normalized = String(token || "").trim();
      return activeBanks().find((bank) => activeVivaTokensForBank(bank).includes(normalized)) || null;
    }

    function findAnyFinalizedBankByVivaToken(token) {
      const normalized = String(token || "").trim();
      return finalizedBanks().find((bank) => (bank.vivaTokens || []).includes(normalized)) || null;
    }

    function validateStudentDetails() {
      const details = {
        fullName: el.studentName.value.trim(),
        rollNo: el.studentRoll.value.trim(),
        contact: el.studentContact.value.trim(),
        email: el.studentEmail.value.trim(),
        course: el.studentCourse.value,
        semester: el.studentSemester.value,
        practical: el.studentPractical.value,
        token: el.studentToken.value.trim().toUpperCase(),
        journalSubmitted: radioValue("journalSubmitted"),
        notesSubmitted: radioValue("notesSubmitted")
      };

      if (!details.fullName || !details.rollNo || !details.contact || !details.email || !details.course || !details.semester || !details.practical || !details.token) {
        return { error: "Complete all student details before generating the paper.", details };
      }
      if (!/^\d{10}$/.test(details.contact)) {
        return { error: "Contact number must be exactly 10 digits.", details };
      }
      if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(details.email)) {
        return { error: "Enter a valid email ID.", details };
      }
      if (!details.journalSubmitted || !details.notesSubmitted) {
        return { error: "Select journal and notes submission status.", details };
      }

      const bank = getBank(details.course, details.semester, details.practical);
      if (!bank || !bank.finalized) {
        return { error: "Selected practical is not finalized by admin.", details };
      }
      if (!isBankActive(bank)) {
        const tokenBank = findAnyFinalizedBankByToken(details.token);
        if (tokenBank?.id === bank.id) {
          return { error: "This Access Code is valid, but the test is not active yet. Ask admin to click Activate Test.", details };
        }
        return { error: "Selected practical test is not active. Ask admin to activate it.", details };
      }
      if (!activeTokensForBank(bank).includes(details.token)) {
        const tokenBank = findBankByToken(details.token);
        if (tokenBank) {
          return {
            error: `This Access Code belongs to ${courseName(tokenBank.course)}, Semester ${tokenBank.semester}, ${tokenBank.practical}.`,
            details
          };
        }
        const finalizedTokenBank = findAnyFinalizedBankByToken(details.token);
        if (finalizedTokenBank) {
          return { error: "This Access Code exists, but its test is not active.", details };
        }
        return { error: "Invalid Access Code for the selected practical session.", details };
      }
      return { details, bank };
    }

    function radioValue(name) {
      return document.querySelector(`input[name="${name}"]:checked`)?.value || "";
    }

    function attemptId(details) {
      return `${details.token}::${slug(details.rollNo)}`;
    }

    function activeBankForAttempt(attempt) {
      const bank = findBankByToken(attempt?.details?.token);
      if (!bank || bank.id !== bankId(attempt.details.course, attempt.details.semester, attempt.details.practical)) {
        return null;
      }
      return bank;
    }

    async function registerAndGeneratePaper() {
      const result = validateStudentDetails();
      if (result.error) {
        setStatus(el.studentStatus, result.error, "error");
        return;
      }

      currentAttemptKey = attemptId(result.details);
      let attempt = state.attempts[currentAttemptKey];
      if (!attempt) {
        const paper = generatePaper(result.bank, null);
        if (!paper) {
        setStatus(el.studentStatus, "Question paper cannot be generated because an active module has no question.", "error");
          return;
        }
        attempt = {
          details: result.details,
          paper,
          changed: false,
          previousPaper: null,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString()
        };
        state.attempts[currentAttemptKey] = attempt;
        const saved = await saveAttempt(currentAttemptKey);
        if (!saved) {
          return;
        }
        setStatus(el.studentStatus, "Registration complete. Randomized question paper generated.", "ok");
      } else {
        attempt.details = result.details;
        attempt.updatedAt = new Date().toISOString();
        state.attempts[currentAttemptKey] = attempt;
        const saved = await saveAttempt(currentAttemptKey);
        if (!saved) {
          return;
        }
        setStatus(el.studentStatus, "Existing question paper loaded for this roll number and Access Code.", "ok");
      }

      renderPaper(attempt);
    }

    function generatePaper(bank, avoidPaper) {
      const sections = {};
      for (const sectionId of activeSectionIds(bank)) {
        const questions = bank.sections[sectionId]?.questions || [];
        const avoided = avoidPaper?.sections?.[sectionId]?.question || "";
        const available = avoided ? questions.filter((question) => question !== avoided) : questions.slice();
        if (!available.length) {
          return null;
        }
        sections[sectionId] = {
          label: moduleLabel(sectionId),
          question: pickRandom(available)
        };
      }
      return {
        generatedAt: new Date().toISOString(),
        sections
      };
    }

    function pickRandom(items) {
      return items[secureRandomInt(items.length)];
    }

    function canChangePaper(bank, paper) {
      return activeSectionIds(bank).every((sectionId) => {
        const current = paper.sections[sectionId]?.question || "";
        const questions = bank.sections[sectionId]?.questions || [];
        return questions.some((question) => question !== current);
      });
    }

    async function changeQuestionPaper() {
      if (!currentAttemptKey || !state.attempts[currentAttemptKey]) {
        setStatus(el.studentStatus, "Generate a question paper before using the change option.", "error");
        return;
      }
      const attempt = state.attempts[currentAttemptKey];
      if (attempt.changed) {
        setStatus(el.studentStatus, "Question paper change option has already been used.", "error");
        return;
      }
      if (attempt.downloadedAt) {
        setStatus(el.studentStatus, "Question paper cannot be changed after the one-time PDF download.", "error");
        return;
      }
      const bank = activeBankForAttempt(attempt);
      if (!bank) {
        setStatus(el.studentStatus, "This test is no longer active. Ask admin to activate the test again.", "error");
        return;
      }
      if (!canChangePaper(bank, attempt.paper)) {
        setStatus(el.studentStatus, "Every active module needs at least one alternate question before the paper can be changed.", "error");
        return;
      }
      const newPaper = generatePaper(bank, attempt.paper);
      if (!newPaper) {
        setStatus(el.studentStatus, "Unable to generate a new paper from the available question bank.", "error");
        return;
      }
      attempt.previousPaper = attempt.paper;
      attempt.paper = newPaper;
      attempt.changed = true;
      attempt.updatedAt = new Date().toISOString();
      state.attempts[currentAttemptKey] = attempt;
      const saved = await saveAttempt(currentAttemptKey);
      if (!saved) {
        return;
      }
      renderPaper(attempt);
      setStatus(el.studentStatus, "Question paper changed. The previous paper is locked and will not be shown again.", "ok");
    }

    function paperChangeLabel(attempt) {
      return attempt.changed ? "Changed once" : "No change used";
    }

    function paperVersionLabel(attempt) {
      return attempt.changed ? "Changed paper" : "Original paper";
    }

    function downloadStatusLabel(attempt) {
      if (!attempt.downloadedAt) {
        return "Not downloaded";
      }
      return `Downloaded ${formatDateTime(attempt.downloadedAt)} (one time)`;
    }

    function renderPaper(attempt) {
      const detailRows = [
        ["Full Name", attempt.details.fullName],
        ["Roll No.", attempt.details.rollNo],
        ["Contact", attempt.details.contact],
        ["Email", attempt.details.email],
        ["Department", courseName(attempt.details.course)],
        ["Semester", attempt.details.semester],
        ["Practical", attempt.details.practical],
        ["Access Code", attempt.details.token],
        ["Journal", attempt.details.journalSubmitted],
        ["Notes", attempt.details.notesSubmitted]
      ];

      const questions = Object.values(attempt.paper.sections).map((section) => {
        return `<div class="question-item"><h4>${escapeHtml(section.label)}</h4><p>${escapeHtml(section.question)}</p></div>`;
      }).join("");

      el.paperOutput.innerHTML = `
        <div class="paper-title">
          <div>
            <h3>B.N.N College Bhiwandi ${EXAM_TITLE}</h3>
            <p class="help">Generated on ${escapeHtml(formatDateTime(attempt.paper.generatedAt))}</p>
          </div>
          <span class="badge">${escapeHtml(paperVersionLabel(attempt))}</span>
        </div>
        <div class="paper-status-panel">
          <div><span>Question Paper Change</span><strong>${escapeHtml(paperChangeLabel(attempt))}</strong></div>
          <div><span>Download Status</span><strong>${escapeHtml(downloadStatusLabel(attempt))}</strong></div>
          <div><span>Downloaded Version</span><strong>${escapeHtml(attempt.downloadedPaperStatus || "Pending download")}</strong></div>
        </div>
        <div class="details-grid">
          ${detailRows.map(([label, value]) => `<div class="detail"><span>${escapeHtml(label)}</span><strong>${escapeHtml(value)}</strong></div>`).join("")}
        </div>
        <div class="question-list">${questions}</div>
      `;
      el.paperOutput.classList.add("show");
      const alreadyDownloaded = Boolean(attempt.downloadedAt);
      el.changePaperBtn.disabled = attempt.changed || alreadyDownloaded;
      el.downloadPdfBtn.disabled = alreadyDownloaded;
      el.downloadPdfBtn.title = alreadyDownloaded ? "PDF has already been downloaded once for this student." : "";
    }

    async function downloadQuestionPaper() {
      if (!currentAttemptKey || !state.attempts[currentAttemptKey]) {
        setStatus(el.studentStatus, "Generate the paper with complete student details before downloading PDF.", "error");
        return;
      }
      const attempt = state.attempts[currentAttemptKey];
      if (attempt.downloadedAt) {
        el.downloadPdfBtn.disabled = true;
        setStatus(el.studentStatus, "PDF has already been downloaded once for this student. Download is locked.", "error");
        return;
      }
      if (!activeBankForAttempt(attempt)) {
        setStatus(el.studentStatus, "This test is no longer active. Download is stopped until admin activates the test again.", "error");
        return;
      }
      const missing = requiredDetailMissing(attempt.details);
      if (missing) {
        setStatus(el.studentStatus, "Student details are compulsory on the PDF. Missing: " + missing + ".", "error");
        return;
      }

      const downloadedAt = new Date().toISOString();
      attempt.downloadedAt = downloadedAt;
      attempt.downloadCount = (Number.parseInt(attempt.downloadCount, 10) || 0) + 1;
      attempt.downloadedPaperStatus = paperVersionLabel(attempt);
      attempt.updatedAt = downloadedAt;
      state.attempts[currentAttemptKey] = attempt;
      const saved = await saveAttempt(currentAttemptKey);
      if (!saved) {
        return;
      }

      setStatus(el.studentStatus, "Preparing formatted PDF...", "ok");
      const logo = await loadPdfLogo();
      const blob = createStructuredQuestionPaperPdf(attempt, logo);
      const filename = `QuestionPaper_${safeFileName(attempt.details.rollNo)}_${safeFileName(attempt.details.token)}.pdf`;
      const link = document.createElement("a");
      link.href = URL.createObjectURL(blob);
      link.download = filename;
      document.body.appendChild(link);
      link.click();
      link.remove();
      setTimeout(() => URL.revokeObjectURL(link.href), 1000);
      renderPaper(attempt);
      setStatus(el.studentStatus, `PDF downloaded. Status saved as ${paperVersionLabel(attempt)}.`, "ok");
    }

    function requiredDetailMissing(details) {
      const fields = {
        "Full Name": details.fullName,
        "Roll No.": details.rollNo,
        "Contact Number": details.contact,
        "Email ID": details.email,
        "Department": details.course,
        "Semester": details.semester,
        "Practical": details.practical,
        "Access Code": details.token,
        "Journal Status": details.journalSubmitted,
        "Notes Status": details.notesSubmitted
      };
      return Object.entries(fields)
        .filter(([, value]) => !String(value || "").trim())
        .map(([label]) => label)
        .join(", ");
    }

    function loadPdfLogo() {
      return new Promise((resolve) => {
        const image = new Image();
        image.onload = () => {
          try {
            const canvas = document.createElement("canvas");
            const size = 180;
            canvas.width = size;
            canvas.height = size;
            const context = canvas.getContext("2d");
            context.fillStyle = "#ffffff";
            context.fillRect(0, 0, size, size);
            const scale = Math.min(size / image.naturalWidth, size / image.naturalHeight);
            const width = image.naturalWidth * scale;
            const height = image.naturalHeight * scale;
            const x = (size - width) / 2;
            const y = (size - height) / 2;
            context.drawImage(image, x, y, width, height);
            const dataUrl = canvas.toDataURL("image/jpeg", 0.92);
            resolve({
              width: size,
              height: size,
              data: atob(dataUrl.split(",")[1] || "")
            });
          } catch (error) {
            resolve(null);
          }
        };
        image.onerror = () => resolve(null);
        image.src = document.querySelector(".college-logo")?.src || "assets/bnn-college-logo.png";
      });
    }

    function createStructuredQuestionPaperPdf(attempt, logo) {
      const pageWidth = 595.28;
      const pageHeight = 841.89;
      const margin = 38;
      const contentWidth = pageWidth - margin * 2;
      const line = {
        ink: "0.06 0.14 0.12",
        muted: "0.36 0.43 0.50",
        border: "0.78 0.84 0.88",
        soft: "0.95 0.98 0.97",
        primary: "0.05 0.46 0.42",
        white: "1 1 1"
      };

      const pages = [];
      let stream = "";
      let y = 0;

      const pushPage = () => {
        if (stream) {
          addFooter(pages.length + 1);
          pages.push(stream);
        }
        stream = "";
        y = pageHeight - margin;
        drawPageHeader(pages.length + 1);
      };

      const finish = () => {
        addFooter(pages.length + 1);
        pages.push(stream);
      };

      const ensureSpace = (height) => {
        if (y - height < margin + 34) {
          pushPage();
        }
      };

      const drawText = (text, x, baseline, size = 10, bold = false, color = line.ink) => {
        stream += `${color} rg BT /${bold ? "F2" : "F1"} ${size} Tf 1 0 0 1 ${x.toFixed(2)} ${baseline.toFixed(2)} Tm (${escapePdf(text)}) Tj ET\n`;
      };

      const drawCenteredText = (text, baseline, size = 10, bold = false, color = line.ink) => {
        const x = (pageWidth - approximateTextWidth(text, size, bold)) / 2;
        drawText(text, Math.max(margin, x), baseline, size, bold, color);
      };

      const drawRightText = (text, rightX, baseline, size = 10, bold = false, color = line.ink) => {
        const x = rightX - approximateTextWidth(text, size, bold);
        drawText(text, Math.max(margin, x), baseline, size, bold, color);
      };

      const drawFittedText = (text, x, baseline, maxWidth, size = 10, bold = false, color = line.ink, minSize = 6.5) => {
        let fontSize = size;
        while (fontSize > minSize && approximateTextWidth(text, fontSize, bold) > maxWidth) {
          fontSize -= 0.3;
        }
        drawText(text, x, baseline, fontSize, bold, color);
      };

      const drawCenteredTextWithin = (text, x, width, baseline, size = 10, bold = false, color = line.ink, minSize = 6.5) => {
        let fontSize = size;
        while (fontSize > minSize && approximateTextWidth(text, fontSize, bold) > width) {
          fontSize -= 0.3;
        }
        const textX = x + Math.max(0, (width - approximateTextWidth(text, fontSize, bold)) / 2);
        drawText(text, textX, baseline, fontSize, bold, color);
      };

      const fillRect = (x, rectY, width, height, color) => {
        stream += `${color} rg ${x.toFixed(2)} ${rectY.toFixed(2)} ${width.toFixed(2)} ${height.toFixed(2)} re f\n`;
      };

      const strokeRect = (x, rectY, width, height, color = line.border) => {
        stream += `${color} RG 0.8 w ${x.toFixed(2)} ${rectY.toFixed(2)} ${width.toFixed(2)} ${height.toFixed(2)} re S\n`;
      };

      const drawRule = (ruleY, color = line.border) => {
        stream += `${color} RG 0.8 w ${margin} ${ruleY.toFixed(2)} m ${pageWidth - margin} ${ruleY.toFixed(2)} l S\n`;
      };

      const drawLogo = (x, imageY, size) => {
        if (logo?.data) {
          stream += `q ${size} 0 0 ${size} ${x.toFixed(2)} ${imageY.toFixed(2)} cm /Im1 Do Q\n`;
          return;
        }
        fillRect(x, imageY, size, size, "0.94 0.98 0.97");
        strokeRect(x, imageY, size, size, line.primary);
        drawText("BNN", x + 13, imageY + size / 2 - 3, 13, true, line.primary);
      };

      const drawPageHeader = (pageNumber) => {
        const headerY = y - 70;
        const logoSize = 48;
        const logoX = margin + 10;
        const textX = margin + 72;
        const metaWidth = 72;
        const metaX = pageWidth - margin - metaWidth - 8;
        const textWidth = metaX - textX - 12;

        fillRect(margin, headerY, contentWidth, 66, "1 1 1");
        strokeRect(margin, headerY, contentWidth, 66, line.border);
        drawLogo(logoX, headerY + 9, logoSize);
        drawCenteredTextWithin("Padmashri Annasaheb Jadhav Bharatiya Samaj Unnati Mandal's", textX, textWidth, headerY + 50, 7.8, false, line.muted);
        drawCenteredTextWithin("B.N.N. College (Arts, Science & Commerce), Bhiwandi", textX, textWidth, headerY + 34, 11.5, true, line.ink);
        drawCenteredTextWithin("Dhamankar Naka, College Road, Bhiwandi, Dist. Thane-421305 (Maharashtra)", textX, textWidth, headerY + 19, 7.6, false, line.muted);
        fillRect(metaX, headerY + 10, metaWidth, 42, line.soft);
        strokeRect(metaX, headerY + 10, metaWidth, 42, "0.72 0.84 0.82");
        drawCenteredTextWithin(EXAM_YEAR, metaX, metaWidth, headerY + 35, 9.5, true, line.primary);
        drawCenteredTextWithin(`Page ${pageNumber}`, metaX, metaWidth, headerY + 20, 8, false, line.muted);
        drawRule(headerY - 8, line.primary);
        y = headerY - 24;
      };

      const addFooter = (pageNumber) => {
        drawRule(34, line.border);
        drawText(`Access Code: ${attempt.details.token}`, margin, 20, 8, false, line.muted);
        drawText(`Downloaded: ${formatDateTime(attempt.downloadedAt)}`, margin + 170, 20, 8, false, line.muted);
        drawRightText(`Page ${pageNumber}`, pageWidth - margin, 20, 8, false, line.muted);
      };

      const drawTitleBlock = () => {
        fillRect(margin, y - 58, contentWidth, 58, "0.94 0.98 0.97");
        strokeRect(margin, y - 58, contentWidth, 58, "0.72 0.84 0.82");
        drawCenteredText("PRACTICAL EXAMINATION QUESTION PAPER", y - 22, 14, true, line.primary);
        drawCenteredText(`${courseName(attempt.details.course)} | Semester ${attempt.details.semester} | ${attempt.details.practical}`, y - 42, 9.5, false, line.ink);
        y -= 76;
      };

      const drawDetailBox = (label, value, x, boxY, width) => {
        fillRect(x, boxY, width, 38, "1 1 1");
        strokeRect(x, boxY, width, 38, line.border);
        drawText(label, x + 8, boxY + 23, 7.5, true, line.muted);
        drawFittedText(String(value || "-"), x + 8, boxY + 9, width - 16, 9.2, true, line.ink);
      };

      const drawDetails = () => {
        const details = [
          ["Full Name", attempt.details.fullName],
          ["Roll No.", attempt.details.rollNo],
          ["Contact", attempt.details.contact],
          ["Email", attempt.details.email],
          ["Course", courseName(attempt.details.course)],
          ["Semester", attempt.details.semester],
          ["Practical", attempt.details.practical],
          ["Access Code", attempt.details.token],
          ["Journal Submitted", attempt.details.journalSubmitted],
          ["Notes Submitted", attempt.details.notesSubmitted],
          ["Paper Version", attempt.downloadedPaperStatus || paperVersionLabel(attempt)],
          ["Generated On", formatDateTime(attempt.paper.generatedAt)]
        ];
        drawText("Student & Examination Details", margin, y, 12, true, line.ink);
        y -= 12;
        const gap = 8;
        const boxWidth = (contentWidth - gap) / 2;
        details.forEach((item, index) => {
          const col = index % 2;
          if (col === 0) {
            ensureSpace(46);
            y -= 42;
          }
          drawDetailBox(item[0], item[1], margin + col * (boxWidth + gap), y, boxWidth);
        });
        y -= 22;
      };

      const drawInstructions = () => {
        ensureSpace(72);
        fillRect(margin, y - 64, contentWidth, 64, "0.99 0.97 0.91");
        strokeRect(margin, y - 64, contentWidth, 64, "0.90 0.78 0.50");
        drawText("Instructions", margin + 10, y - 17, 11, true, "0.45 0.29 0.03");
        drawText("1. Write answers clearly and follow the practical examination instructions given by the examiner.", margin + 10, y - 34, 8.6, false, line.ink);
        drawText("2. This question paper is generated against the active Access Code shown above.", margin + 10, y - 48, 8.6, false, line.ink);
        y -= 82;
      };

      const drawQuestions = () => {
        ensureSpace(40);
        fillRect(margin, y - 26, contentWidth, 26, line.primary);
        drawText("Modules", margin + 10, y - 17, 12, true, line.white);
        y -= 42;
        Object.values(attempt.paper.sections).forEach((section, index) => {
          const questionLines = wrapText(`Q${index + 1}. ${section.question}`, 86);
          const height = 36 + questionLines.length * 13 + 26;
          ensureSpace(height);
          fillRect(margin, y - 24, contentWidth, 24, "0.94 0.98 0.97");
          strokeRect(margin, y - 24, contentWidth, 24, "0.72 0.84 0.82");
          drawText(section.label, margin + 10, y - 16, 10, true, line.primary);
          y -= 42;
          questionLines.forEach((text) => {
            drawText(text, margin + 12, y, 10.5, false, line.ink);
            y -= 14;
          });
          y -= 8;
          stream += `${line.border} RG 0.6 w ${margin + 12} ${y.toFixed(2)} m ${pageWidth - margin - 12} ${y.toFixed(2)} l S\n`;
          y -= 26;
        });
      };

      const drawSignatureBlock = () => {
        ensureSpace(72);
        fillRect(margin, y - 56, contentWidth, 56, "1 1 1");
        strokeRect(margin, y - 56, contentWidth, 56, line.border);
        const colWidth = (contentWidth - 30) / 2;
        const leftX = margin + 14;
        const rightX = margin + 16 + colWidth + 16;
        stream += `${line.border} RG 0.7 w ${leftX.toFixed(2)} ${(y - 30).toFixed(2)} m ${(leftX + colWidth).toFixed(2)} ${(y - 30).toFixed(2)} l S\n`;
        stream += `${line.border} RG 0.7 w ${rightX.toFixed(2)} ${(y - 30).toFixed(2)} m ${(rightX + colWidth).toFixed(2)} ${(y - 30).toFixed(2)} l S\n`;
        drawText("Student Signature", leftX, y - 44, 8.2, true, line.muted);
        drawText("Examiner Signature", rightX, y - 44, 8.2, true, line.muted);
        y -= 76;
      };

      pushPage();
      drawTitleBlock();
      drawDetails();
      drawInstructions();
      drawQuestions();
      drawSignatureBlock();
      finish();

      return buildPdfDocument(pages, logo);

      function buildPdfDocument(pageStreams, logoImage) {
        const objects = [];
        objects[1] = "<< /Type /Catalog /Pages 2 0 R >>";
        objects[3] = "<< /Type /Font /Subtype /Type1 /BaseFont /Helvetica >>";
        objects[4] = "<< /Type /Font /Subtype /Type1 /BaseFont /Helvetica-Bold >>";
        let nextObject = 5;
        let logoObject = 0;
        if (logoImage?.data) {
          logoObject = nextObject;
          objects[logoObject] = `<< /Type /XObject /Subtype /Image /Width ${logoImage.width} /Height ${logoImage.height} /ColorSpace /DeviceRGB /BitsPerComponent 8 /Filter /DCTDecode /Length ${logoImage.data.length} >>\nstream\n${logoImage.data}\nendstream`;
          nextObject += 1;
        }

        const pageRefs = [];
        pageStreams.forEach((pageStream, index) => {
          const pageObject = nextObject + index * 2;
          const contentObject = pageObject + 1;
          const imageResources = logoObject ? `/XObject << /Im1 ${logoObject} 0 R >>` : "";
          pageRefs.push(`${pageObject} 0 R`);
          objects[pageObject] = `<< /Type /Page /Parent 2 0 R /MediaBox [0 0 ${pageWidth} ${pageHeight}] /Resources << /Font << /F1 3 0 R /F2 4 0 R >> ${imageResources} >> /Contents ${contentObject} 0 R >>`;
          objects[contentObject] = `<< /Length ${pageStream.length} >>\nstream\n${pageStream}endstream`;
        });

        objects[2] = `<< /Type /Pages /Kids [${pageRefs.join(" ")}] /Count ${pageStreams.length} >>`;
        const objectCount = objects.length - 1;
        let pdf = "%PDF-1.4\n";
        const offsets = [0];
        for (let i = 1; i <= objectCount; i += 1) {
          offsets[i] = pdf.length;
          pdf += `${i} 0 obj\n${objects[i]}\nendobj\n`;
        }
        const xrefOffset = pdf.length;
        pdf += `xref\n0 ${objectCount + 1}\n`;
        pdf += "0000000000 65535 f \n";
        for (let i = 1; i <= objectCount; i += 1) {
          pdf += `${String(offsets[i]).padStart(10, "0")} 00000 n \n`;
        }
        pdf += `trailer\n<< /Size ${objectCount + 1} /Root 1 0 R >>\nstartxref\n${xrefOffset}\n%%EOF`;
        const bytes = new Uint8Array(pdf.length);
        for (let i = 0; i < pdf.length; i += 1) {
          bytes[i] = pdf.charCodeAt(i) & 0xff;
        }
        return new Blob([bytes], { type: "application/pdf" });
      }
    }

    function approximateTextWidth(text, size, bold) {
      const weight = bold ? 0.58 : 0.52;
      return String(text || "").length * size * weight;
    }

    function buildQuestionPaperLines(attempt) {
      const lines = [
        { text: "B.N.N College Bhiwandi", size: 16, bold: true },
        { text: `${EXAM_TITLE} Question Paper`, size: 14, bold: true },
        { text: `Generated: ${formatDateTime(attempt.paper.generatedAt)}`, size: 10 },
        { text: `Question Paper Change: ${paperChangeLabel(attempt)}`, size: 10 },
        { text: `Downloaded Version: ${attempt.downloadedPaperStatus || paperVersionLabel(attempt)}`, size: 10 },
        { text: `Downloaded: ${attempt.downloadedAt ? formatDateTime(attempt.downloadedAt) : "Not downloaded"}`, size: 10 },
        { text: `Download Count: ${Number.parseInt(attempt.downloadCount, 10) || 0}`, size: 10 },
        { text: "", size: 10 },
        { text: "Student Details", size: 13, bold: true },
        { text: `Full Name: ${attempt.details.fullName}`, size: 10 },
        { text: `Roll No.: ${attempt.details.rollNo}`, size: 10 },
        { text: `Contact Number: ${attempt.details.contact}`, size: 10 },
        { text: `Email ID: ${attempt.details.email}`, size: 10 },
        { text: `Department: ${courseName(attempt.details.course)}`, size: 10 },
        { text: `Semester: ${attempt.details.semester}`, size: 10 },
        { text: `Practical: ${attempt.details.practical}`, size: 10 },
        { text: `Access Code: ${attempt.details.token}`, size: 10 },
        { text: `Practical Journal Submitted: ${attempt.details.journalSubmitted}`, size: 10 },
        { text: `Practical Notes Submitted: ${attempt.details.notesSubmitted}`, size: 10 },
        { text: "", size: 10 },
        { text: "Modules", size: 13, bold: true }
      ];

      Object.values(attempt.paper.sections).forEach((section) => {
        lines.push({ text: section.label, size: 11, bold: true });
        lines.push({ text: `Q. ${section.question}`, size: 10 });
      });
      return lines;
    }

    function createPdfBlob(lines) {
      const pageWidth = 595.28;
      const pageHeight = 841.89;
      const margin = 42;
      const lineHeight = 16;
      const maxLinesPerPage = Math.floor((pageHeight - margin * 2) / lineHeight);
      const normalized = [];

      lines.forEach((line) => {
        const wrapped = wrapText(line.text, line.size >= 13 ? 62 : 88);
        if (!wrapped.length) {
          normalized.push({ text: "", size: line.size || 10, bold: Boolean(line.bold) });
        } else {
          wrapped.forEach((text) => normalized.push({ text, size: line.size || 10, bold: Boolean(line.bold) }));
        }
      });

      const pages = [];
      for (let i = 0; i < normalized.length; i += maxLinesPerPage) {
        pages.push(normalized.slice(i, i + maxLinesPerPage));
      }

      const objectCount = 4 + pages.length * 2;
      const objects = new Array(objectCount + 1);
      const pageRefs = [];
      objects[1] = "<< /Type /Catalog /Pages 2 0 R >>";
      objects[3] = "<< /Type /Font /Subtype /Type1 /BaseFont /Helvetica >>";
      objects[4] = "<< /Type /Font /Subtype /Type1 /BaseFont /Helvetica-Bold >>";

      pages.forEach((pageLines, index) => {
        const pageObj = 5 + index * 2;
        const contentObj = pageObj + 1;
        pageRefs.push(`${pageObj} 0 R`);
        objects[pageObj] = `<< /Type /Page /Parent 2 0 R /MediaBox [0 0 ${pageWidth} ${pageHeight}] /Resources << /Font << /F1 3 0 R /F2 4 0 R >> >> /Contents ${contentObj} 0 R >>`;
        let stream = "";
        pageLines.forEach((line, lineIndex) => {
          const x = margin;
          const y = pageHeight - margin - lineIndex * lineHeight;
          const font = line.bold ? "F2" : "F1";
          stream += `BT /${font} ${line.size} Tf 1 0 0 1 ${x} ${y.toFixed(2)} Tm (${escapePdf(line.text)}) Tj ET\n`;
        });
        objects[contentObj] = `<< /Length ${asciiByteLength(stream)} >>\nstream\n${stream}endstream`;
      });

      objects[2] = `<< /Type /Pages /Kids [${pageRefs.join(" ")}] /Count ${pages.length} >>`;

      let pdf = "%PDF-1.4\n";
      const offsets = [0];
      for (let i = 1; i <= objectCount; i += 1) {
        offsets[i] = asciiByteLength(pdf);
        pdf += `${i} 0 obj\n${objects[i]}\nendobj\n`;
      }
      const xrefOffset = asciiByteLength(pdf);
      pdf += `xref\n0 ${objectCount + 1}\n`;
      pdf += "0000000000 65535 f \n";
      for (let i = 1; i <= objectCount; i += 1) {
        pdf += `${String(offsets[i]).padStart(10, "0")} 00000 n \n`;
      }
      pdf += `trailer\n<< /Size ${objectCount + 1} /Root 1 0 R >>\nstartxref\n${xrefOffset}\n%%EOF`;
      return new Blob([pdf], { type: "application/pdf" });
    }

    function wrapText(text, maxChars) {
      const clean = toAscii(String(text || ""));
      if (!clean) {
        return [];
      }
      const words = clean.split(/\s+/);
      const lines = [];
      let current = "";
      words.forEach((word) => {
        if (word.length > maxChars) {
          if (current) {
            lines.push(current);
            current = "";
          }
          for (let i = 0; i < word.length; i += maxChars) {
            lines.push(word.slice(i, i + maxChars));
          }
          return;
        }
        const candidate = current ? `${current} ${word}` : word;
        if (candidate.length > maxChars) {
          lines.push(current);
          current = word;
        } else {
          current = candidate;
        }
      });
      if (current) {
        lines.push(current);
      }
      return lines;
    }

    function toAscii(value) {
      return String(value || "").replace(/[^\x20-\x7E]/g, "?");
    }

    function escapePdf(value) {
      return toAscii(value).replace(/\\/g, "\\\\").replace(/\(/g, "\\(").replace(/\)/g, "\\)");
    }

    function asciiByteLength(value) {
      return toAscii(value).length;
    }

    async function generateViva() {
      const token = el.vivaToken.value.trim();
      if (!token) {
        setStatus(el.vivaStatus, "Enter a 4 digit Viva Access Code.", "error");
        return;
      }
      const paperTokenBank = findBankByToken(token) || findAnyFinalizedBankByToken(token);
      if (paperTokenBank) {
        setStatus(el.vivaStatus, "Question Paper Access Codes are not accepted in the Viva module. Enter a 4 digit Viva Access Code.", "error");
        return;
      }
      if (!/^\d{4}$/.test(token)) {
        setStatus(el.vivaStatus, "Viva Access Code must be exactly 4 digits.", "error");
        return;
      }
      const bank = findBankByVivaToken(token);
      if (!bank) {
        const finalizedVivaBank = findAnyFinalizedBankByVivaToken(token);
        setStatus(
          el.vivaStatus,
          finalizedVivaBank ? "This Viva Access Code exists, but its test is not active." : "Invalid Viva Access Code. Admin must activate the practical test first.",
          "error"
        );
        return;
      }
      if (!bank.syllabus.trim()) {
        setStatus(el.vivaStatus, "Admin has not uploaded the viva syllabus for this practical.", "error");
        return;
      }

      const vivaKey = `viva::${token}`;
      let attempt = state.vivaAttempts[vivaKey];
      if (!attempt) {
        attempt = {
          token,
          course: bank.course,
          semester: bank.semester,
          practical: bank.practical,
          questions: buildVivaQuestions(bank.syllabus),
          generatedAt: new Date().toISOString()
        };
        state.vivaAttempts[vivaKey] = attempt;
        const saved = await saveVivaAttempt(vivaKey);
        if (!saved) {
          return;
        }
      }
      renderViva(attempt);
      setStatus(el.vivaStatus, "Viva questions generated from the uploaded syllabus.", "ok");
    }

    function buildVivaQuestions(syllabus) {
      const topics = extractTopics(syllabus);
      const templates = [
        "Explain {topic} with one practical example.",
        "How would you implement {topic} during a practical examination?",
        "State the expected output or result when working with {topic}.",
        "Which errors can occur in {topic}, and how would you troubleshoot them?",
        "Compare {topic} with another related concept from the syllabus.",
        "What are the important steps, syntax, or rules involved in {topic}?"
      ];
      const shuffledTopics = shuffle(topics);
      const shuffledTemplates = shuffle(templates);
      const questions = [];
      for (let i = 0; questions.length < 3; i += 1) {
        const topic = shuffledTopics[i % shuffledTopics.length] || "the uploaded syllabus";
        const template = shuffledTemplates[i % shuffledTemplates.length];
        const question = template.replace("{topic}", topic);
        if (!questions.includes(question)) {
          questions.push(question);
        }
      }
      return questions.slice(0, 3);
    }

    function extractTopics(syllabus) {
      const rawLines = syllabus
        .split(/\r?\n|[.;]/)
        .map((line) => line.replace(/^\s*(?:[-*]|\d+[.)])\s*/, "").trim())
        .filter((line) => line.length >= 4 && line.length <= 90);
      const lineTopics = rawLines.slice(0, 30);
      if (lineTopics.length >= 3) {
        return lineTopics;
      }
      const words = syllabus
        .toLowerCase()
        .replace(/[^a-z0-9\s]/g, " ")
        .split(/\s+/)
        .filter((word) => word.length > 3 && !STOPWORDS.has(word));
      const unique = Array.from(new Set(words)).slice(0, 30);
      return unique.length ? unique : ["the uploaded syllabus"];
    }

    function shuffle(items) {
      const copy = items.slice();
      for (let i = copy.length - 1; i > 0; i -= 1) {
        const j = secureRandomInt(i + 1);
        [copy[i], copy[j]] = [copy[j], copy[i]];
      }
      return copy;
    }

    function renderViva(attempt) {
      el.vivaOutput.innerHTML = attempt.questions.map((question, index) => {
        return `<div class="question-item"><h4>Viva Question ${index + 1}</h4><p>${escapeHtml(question)}</p></div>`;
      }).join("");
      el.vivaOutput.classList.add("show");
    }

    function exportRecords() {
      if (!requireAdmin()) {
        return;
      }
      const payload = {
        exportedAt: new Date().toISOString(),
        examTitle: EXAM_TITLE,
        data: state
      };
      const blob = new Blob([JSON.stringify(payload, null, 2)], { type: "application/json" });
      const link = document.createElement("a");
      link.href = URL.createObjectURL(blob);
      link.download = `BNN_Practical_Examination_${EXAM_YEAR}_Records.json`;
      document.body.appendChild(link);
      link.click();
      link.remove();
      setTimeout(() => URL.revokeObjectURL(link.href), 1000);
      if (el.settingsStatus) {
        setStatus(el.settingsStatus, "All Firebase records exported.", "ok");
      }
    }

    function renderAllSummaries() {
      if (!currentAdmin) {
        renderLockedSummaries();
        return;
      }
      const bankCount = Object.keys(state.banks).length;
      const activeCount = activeTests().length;
      const attemptCount = Object.keys(state.attempts).length;
      const vivaCount = Object.keys(state.vivaAttempts).length;
      const summaryText = `${bankCount} question banks | ${activeCount} active tests | ${attemptCount} generated papers | ${vivaCount} viva attempts`;
      el.metricBanks.textContent = bankCount;
      el.metricActiveTests.textContent = activeCount;
      el.metricAttempts.textContent = attemptCount;
      el.dashboardSummaryText.textContent = summaryText;
      el.recordsSummaryText.textContent = summaryText;
      el.recordBankCount.textContent = bankCount;
      el.recordPaperCount.textContent = attemptCount;
      el.recordVivaCount.textContent = vivaCount;
      renderCourses();
      renderSemesters();
      renderSubjects();
      renderQuestionPapers();
      renderActiveTestList();
      renderAdminSummary();
      renderRecords();
    }

    function renderLockedSummaries() {
      const lockedText = "Login required to view examination data";
      el.metricBanks.textContent = "-";
      el.metricActiveTests.textContent = "-";
      el.metricAttempts.textContent = "-";
      el.dashboardSummaryText.textContent = lockedText;
      el.recordsSummaryText.textContent = lockedText;
      el.recordBankCount.textContent = "0";
      el.recordPaperCount.textContent = "0";
      el.recordVivaCount.textContent = "0";
      el.courseCards.innerHTML = "";
      el.semesterTableBody.innerHTML = emptyTableRow(6, lockedText);
      el.subjectTableBody.innerHTML = emptyTableRow(6, lockedText);
      el.paperBankCount.textContent = "0";
      el.paperActiveCount.textContent = "0";
      el.paperGeneratedCount.textContent = "0";
      el.paperBankTableBody.innerHTML = emptyTableRow(6, lockedText);
      el.generatedPaperTableBody.innerHTML = emptyTableRow(5, lockedText);
      el.activeTestList.innerHTML = `<p class="help">${lockedText}.</p>`;
      el.adminSummary.innerHTML = `<p class="help">${lockedText}.</p>`;
      el.recordsOutput.innerHTML = `<p class="help">${lockedText}.</p>`;
    }

    function renderActiveTestList() {
      const tests = activeTests().sort((a, b) => (b.activatedAt || "").localeCompare(a.activatedAt || ""));
      if (!tests.length) {
        el.activeTestList.innerHTML = `<p class="help">No active tests yet.</p>`;
        return;
      }
      el.activeTestList.innerHTML = tests.map((test) => {
        const bank = state.banks[test.bankId] || test;
        const tokenCount = (test.tokens || []).length;
        const vivaTokenCount = (test.vivaTokens || []).length;
        return `
          <div class="active-test-card">
            <div>
              <strong>${escapeHtml(bank.practical || "Deleted practical")}</strong>
              <span>${escapeHtml(courseName(bank.course || test.course))}, Semester ${escapeHtml(bank.semester || test.semester)} | Paper: ${tokenCount} | Viva: ${vivaTokenCount}</span>
              <span>Activated ${escapeHtml(formatDateTime(test.activatedAt))} by ${escapeHtml(test.activatedBy || "admin")}</span>
            </div>
            <button class="icon-btn" type="button" data-action="delete-active-test" data-bank-id="${escapeHtml(test.bankId)}" title="Delete active test" aria-label="Delete active test for ${escapeHtml(bank.practical || test.practical)}">
              <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" aria-hidden="true"><path d="M3 6h18"></path><path d="M8 6V4h8v2"></path><path d="M19 6l-1 15H6L5 6"></path><path d="M10 11v6"></path><path d="M14 11v6"></path></svg>
            </button>
          </div>
        `;
      }).join("");
    }

    function renderAdminSummary() {
      const banks = Object.values(state.banks).sort((a, b) => (b.updatedAt || "").localeCompare(a.updatedAt || ""));
      if (!banks.length) {
        el.adminSummary.innerHTML = `<p class="help">Saved practical banks will appear here.</p>`;
        return;
      }
      el.adminSummary.innerHTML = banks.slice(0, 5).map((bank) => {
        const counts = activeSectionIds(bank).map((id) => `${moduleShortLabel(id)}: ${bank.sections[id]?.questions.length || 0}`).join(" | ");
        const stateLabel = selectedBankStateLabel(bank);
        return `
          <div class="summary-item ${isBankActive(bank) ? "live" : bank.finalized ? "warning" : ""}">
            <strong>${escapeHtml(bank.practical)}</strong>
            <span>${escapeHtml(courseName(bank.course))}, Semester ${escapeHtml(bank.semester)}</span>
            <span>${counts} | ${stateLabel} | Paper codes: ${(bank.tokens || []).length} | Viva codes: ${(bank.vivaTokens || []).length}</span>
          </div>
        `;
      }).join("");
    }

    function renderRecords() {
      const bankCount = Object.keys(state.banks).length;
      const activeCount = activeTests().length;
      const attemptCount = Object.keys(state.attempts).length;
      const vivaCount = Object.keys(state.vivaAttempts).length;
      const banks = Object.values(state.banks).sort((a, b) => (b.updatedAt || "").localeCompare(a.updatedAt || ""));
      const tests = activeTests().sort((a, b) => (b.activatedAt || "").localeCompare(a.activatedAt || ""));
      const attempts = Object.values(state.attempts).sort((a, b) => (b.updatedAt || "").localeCompare(a.updatedAt || ""));
      const viva = Object.values(state.vivaAttempts).sort((a, b) => (b.generatedAt || "").localeCompare(a.generatedAt || ""));

      let html = "";
      html += tests.map((test) => {
        const bank = state.banks[test.bankId] || test;
        return `
          <div class="summary-item live">
            <strong>Active Test: ${escapeHtml(bank.practical || test.practical)}</strong>
            <span>${escapeHtml(courseName(bank.course || test.course))}, Semester ${escapeHtml(bank.semester || test.semester)} | Paper codes: ${(test.tokens || []).length} | Viva codes: ${(test.vivaTokens || []).length}</span>
            <span>Activated: ${escapeHtml(formatDateTime(test.activatedAt))} | Admin: ${escapeHtml(test.activatedBy || "admin")}</span>
          </div>
        `;
      }).join("");
      html += banks.map((bank) => `
        <div class="summary-item ${isBankActive(bank) ? "live" : bank.finalized ? "warning" : ""}">
          <strong>${escapeHtml(bank.practical)}</strong>
          <span>${escapeHtml(courseName(bank.course))}, Semester ${escapeHtml(bank.semester)} | ${selectedBankStateLabel(bank)} | Paper codes: ${(bank.tokens || []).length} | Viva codes: ${(bank.vivaTokens || []).length}</span>
        </div>
      `).join("");
      html += attempts.map((attempt) => `
        <div class="summary-item ${attempt.downloadedAt ? "downloaded" : "warning"}">
          <strong>${escapeHtml(attempt.details.fullName)} (${escapeHtml(attempt.details.rollNo)})</strong>
          <span>${escapeHtml(attempt.details.practical)} | Access Code: ${escapeHtml(attempt.details.token)} | ${paperChangeLabel(attempt)} | ${downloadStatusLabel(attempt)}</span>
          <span>Downloaded version: ${escapeHtml(attempt.downloadedPaperStatus || "Pending download")}</span>
        </div>
      `).join("");
      html += viva.map((attempt) => `
        <div class="summary-item">
          <strong>Viva: ${escapeHtml(attempt.practical)}</strong>
          <span>Viva Code: ${escapeHtml(attempt.token)} | Generated: ${escapeHtml(formatDateTime(attempt.generatedAt))}</span>
        </div>
      `).join("");

      el.recordsOutput.innerHTML = html || `<p class="help">No detailed records yet. Generate a bank, activate a test, or create a student paper to populate this list.</p>`;
    }

    function setStatus(target, message, type) {
      target.textContent = message;
      target.className = `status show ${type || ""}`;
    }

    function formatDateTime(value) {
      if (!value) {
        return "";
      }
      return new Date(value).toLocaleString("en-IN", {
        year: "numeric",
        month: "short",
        day: "2-digit",
        hour: "2-digit",
        minute: "2-digit"
      });
    }

    function safeFileName(value) {
      return String(value || "file").replace(/[^a-z0-9_-]+/gi, "_").replace(/^_+|_+$/g, "") || "file";
    }

    function escapeHtml(value) {
      return String(value ?? "")
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;")
        .replace(/"/g, "&quot;")
        .replace(/'/g, "&#039;");
    }

