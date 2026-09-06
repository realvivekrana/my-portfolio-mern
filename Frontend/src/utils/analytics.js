import API from './axios';

/*
|--------------------------------------------------------------------------
| Lightweight Self-Hosted Analytics
|--------------------------------------------------------------------------
|
| Ye chhota sa utility Google Analytics / Umami / Plausible jaisa kaam
| karta hai, lekin bina kisi third-party account/script ke — sab kuch
| apne hi MongoDB + Express backend (POST /api/analytics/track) me
| store hota hai.
|
| Teen cheezein track hoti hain:
|
|   1. trackPageView()        -> Portfolio visit hui
|   2. trackProjectClick()    -> Kaunsa project click hua (view/github/live)
|   3. trackResumeDownload()  -> Resume download hua
|
| IMPORTANT: Analytics kabhi bhi visitor ke experience ko break nahi
| karni chahiye — isliye har call fire-and-forget hai aur errors
| silently ignore ho jaate hain.
|
|--------------------------------------------------------------------------
*/

const VISITOR_ID_KEY = 'pf_visitor_id';
const SESSION_ID_KEY = 'pf_session_id';

/*
|--------------------------------------------------------------------------
| Generate Random ID
|--------------------------------------------------------------------------
|
| window.crypto.randomUUID() sab modern browsers me available hai,
| lekin fallback bhi rakha hai purane browsers ke liye.
|
|--------------------------------------------------------------------------
*/

const generateId = () => {
  if (
    typeof window !== 'undefined' &&
    window.crypto &&
    typeof window.crypto.randomUUID === 'function'
  ) {
    return window.crypto.randomUUID();
  }

  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(
    /[xy]/g,
    (c) => {
      const r = (Math.random() * 16) | 0;
      const v = c === 'x' ? r : (r & 0x3) | 0x8;
      return v.toString(16);
    }
  );
};

/*
|--------------------------------------------------------------------------
| Visitor ID (persists across visits — used for "unique visitors")
|--------------------------------------------------------------------------
*/

export const getVisitorId = () => {
  try {
    let id = window.localStorage.getItem(VISITOR_ID_KEY);

    if (!id) {
      id = generateId();
      window.localStorage.setItem(VISITOR_ID_KEY, id);
    }

    return id;
  } catch (error) {
    // Private browsing / storage disabled — analytics ke bina bhi
    // site normally kaam karti rahegi.
    return '';
  }
};

/*
|--------------------------------------------------------------------------
| Session ID (resets every tab/session — used for "sessions" grouping)
|--------------------------------------------------------------------------
*/

export const getSessionId = () => {
  try {
    let id = window.sessionStorage.getItem(SESSION_ID_KEY);

    if (!id) {
      id = generateId();
      window.sessionStorage.setItem(SESSION_ID_KEY, id);
    }

    return id;
  } catch (error) {
    return '';
  }
};

/*
|--------------------------------------------------------------------------
| Send Track Event (fire-and-forget)
|--------------------------------------------------------------------------
*/

const sendTrackEvent = (payload) => {
  try {
    API.post('/analytics/track', {
      visitorId: getVisitorId(),
      sessionId: getSessionId(),
      ...payload,
    }).catch(() => {
      // Analytics failure ko silently ignore karo.
    });
  } catch (error) {
    // Kabhi bhi UI ko break mat hone do.
  }
};

/*
|--------------------------------------------------------------------------
| Track Page View
|--------------------------------------------------------------------------
*/

export const trackPageView = (
  path = window.location.pathname
) => {
  sendTrackEvent({
    type: 'pageview',
    path,
    referrer: document.referrer || '',
  });
};

/*
|--------------------------------------------------------------------------
| Track Project Click
|--------------------------------------------------------------------------
|
| action: 'view' | 'github' | 'live'
|
|--------------------------------------------------------------------------
*/

export const trackProjectClick = (
  projectId,
  projectTitle,
  action = 'view'
) => {
  if (!projectId) {
    return;
  }

  sendTrackEvent({
    type: 'project_click',
    projectId,
    projectTitle: projectTitle || '',
    action,
  });
};

/*
|--------------------------------------------------------------------------
| Track Resume Download
|--------------------------------------------------------------------------
*/

export const trackResumeDownload = () => {
  sendTrackEvent({
    type: 'resume_download',
  });
};