/*
|--------------------------------------------------------------------------
| TRANSLATIONS
|--------------------------------------------------------------------------
|
| English / Hindi dictionary for the portfolio's static UI text
| (navigation, footer, section headings/eyebrows/subtitles, command
| palette, PWA install prompt). Dynamic content that comes from the
| backend (project descriptions, blog posts, testimonials, etc.) is
| authored by the admin and is NOT translated here — only the
| surrounding UI chrome is.
|
| Usage: const { t } = useLanguage(); t('nav.home')
|
|--------------------------------------------------------------------------
*/

const translations = {
  en: {
    nav: {
      home: 'Home',
      about: 'About',
      skills: 'Skills',
      experience: 'Experience',
      projects: 'Projects',
      contact: 'Contact',
      admin: 'Admin',
    },
    theme: {
      light: 'Switch to light mode',
      dark: 'Switch to dark mode',
      switchToLight: 'Switch to Light Mode',
      switchToDark: 'Switch to Dark Mode',
    },
    language: {
      label: 'Language',
      switchTo: 'हिंदी में देखें',
    },
    about: {
      eyebrow: 'Get To Know Me',
      heading: 'About',
      headingHighlight: 'Me',
      subtitle:
        "I'm a MERN Stack Developer focused on building modern, scalable and user-friendly web applications. I enjoy turning complex problems into clean and intuitive digital experiences.",
    },
    skills: {
      eyebrow: 'My Tech Stack',
      heading: 'Skills &',
      headingHighlight: 'Technologies',
    },
    experience: {
      eyebrow: 'Career',
      heading: 'Professional Experience',
      subtitle:
        'My professional journey, responsibilities and the technologies I have worked with.',
    },
    education: {
      eyebrow: 'Education',
      heading: 'Academic Journey',
      subtitle:
        'My academic background and the knowledge that has helped shape my development journey.',
    },
    certifications: {
      eyebrow: 'Credentials',
      heading: 'Certifications &',
      headingHighlight: 'Learning',
      subtitle:
        'Certifications and learning milestones that support my technical skills and continuous professional growth.',
    },
    timeline: {
      eyebrow: 'My Journey',
      heading: 'Experience &',
      headingHighlight: 'Education',
      headingSuffix: 'Timeline',
      subtitle:
        'A single chronological view of my career and academic path — newest first.',
    },
    projects: {
      eyebrow: 'My Work',
      heading: 'Projects &',
      headingHighlight: 'Case Studies',
      subtitle:
        'A selection of projects that demonstrate my experience with frontend, backend and full-stack development.',
    },
    testimonials: {
      eyebrow: 'Kind Words',
      heading: 'What People',
      headingHighlight: 'Say',
      subtitle:
        "Feedback from clients and colleagues I've had the pleasure of working with.",
    },
    blog: {
      eyebrow: 'From the Blog',
      heading: 'Latest',
      headingHighlight: 'Articles',
    },
    contact: {
      eyebrow: 'Get In Touch',
      heading: "Let's",
      headingHighlight: 'Connect',
      subtitle:
        'Have a project, opportunity or just want to talk about development? Feel free to reach out.',
    },
    footer: {
      quickLinks: 'Quick Links',
      contact: 'Contact',
      resume: 'Resume',
      email: 'Email',
      phone: 'Phone',
      location: 'Location',
      rights: 'All rights reserved.',
      builtWith: 'Built with',
      ctaBadge: 'Open to opportunities',
      ctaHeading: "Let's build something meaningful together.",
      ctaSubtitle:
        "Have a project, opportunity or idea in mind? Feel free to get in touch and let's talk.",
      ctaButton: 'Get in touch',
    },
    commandPalette: {
      placeholder: 'Type a command or search...',
      noResults: 'No results found.',
      hint: 'Navigate',
      hintSelect: 'Select',
      hintClose: 'Close',
      groupNavigation: 'Navigation',
      groupActions: 'Actions',
      goToHome: 'Go to Home',
      goToAbout: 'Go to About',
      goToSkills: 'Go to Skills',
      goToExperience: 'Go to Experience',
      goToProjects: 'Go to Projects',
      goToContact: 'Contact me',
      toggleTheme: 'Toggle dark / light mode',
      toggleLanguage: 'Switch language (English / Hindi)',
      viewResume: 'View resume',
      openBlog: 'Open blog',
      adminLogin: 'Admin login',
    },
    pwa: {
      installTitle: 'Install this portfolio',
      installBody: 'Add it to your home screen for quick, offline-friendly access.',
      installButton: 'Install',
      dismissButton: 'Not now',
      offlineTitle: "You're offline",
      offlineBody:
        "It looks like you've lost your internet connection. Some parts of this portfolio need a connection to load.",
      offlineRetry: 'Try again',
    },
  },

  hi: {
    nav: {
      home: 'होम',
      about: 'परिचय',
      skills: 'कौशल',
      experience: 'अनुभव',
      projects: 'प्रोजेक्ट्स',
      contact: 'संपर्क',
      admin: 'एडमिन',
    },
    theme: {
      light: 'लाइट मोड पर जाएं',
      dark: 'डार्क मोड पर जाएं',
      switchToLight: 'लाइट मोड पर स्विच करें',
      switchToDark: 'डार्क मोड पर स्विच करें',
    },
    language: {
      label: 'भाषा',
      switchTo: 'View in English',
    },
    about: {
      eyebrow: 'मुझे जानिए',
      heading: 'मेरे',
      headingHighlight: 'बारे में',
      subtitle:
        'मैं एक MERN स्टैक डेवलपर हूं जो आधुनिक, स्केलेबल और यूज़र-फ्रेंडली वेब एप्लिकेशन बनाने पर ध्यान केंद्रित करता हूं। मुझे जटिल समस्याओं को साफ़ और सहज डिजिटल अनुभवों में बदलना पसंद है।',
    },
    skills: {
      eyebrow: 'मेरी टेक स्टैक',
      heading: 'कौशल और',
      headingHighlight: 'तकनीकें',
    },
    experience: {
      eyebrow: 'करियर',
      heading: 'व्यावसायिक अनुभव',
      subtitle:
        'मेरी व्यावसायिक यात्रा, जिम्मेदारियां और वे तकनीकें जिन पर मैंने काम किया है।',
    },
    education: {
      eyebrow: 'शिक्षा',
      heading: 'शैक्षणिक यात्रा',
      subtitle:
        'मेरी शैक्षणिक पृष्ठभूमि और वह ज्ञान जिसने मेरी विकास यात्रा को आकार देने में मदद की है।',
    },
    certifications: {
      eyebrow: 'प्रमाणपत्र',
      heading: 'प्रमाणपत्र और',
      headingHighlight: 'शिक्षा',
      subtitle:
        'प्रमाणपत्र और सीखने के पड़ाव जो मेरे तकनीकी कौशल और निरंतर व्यावसायिक विकास का समर्थन करते हैं।',
    },
    timeline: {
      eyebrow: 'मेरी यात्रा',
      heading: 'अनुभव और',
      headingHighlight: 'शिक्षा',
      headingSuffix: 'टाइमलाइन',
      subtitle:
        'मेरे करियर और शैक्षणिक पथ का एक कालानुक्रमिक दृश्य — सबसे नया पहले।',
    },
    projects: {
      eyebrow: 'मेरा काम',
      heading: 'प्रोजेक्ट्स और',
      headingHighlight: 'केस स्टडीज',
      subtitle:
        'ऐसे प्रोजेक्ट्स का चयन जो फ्रंटएंड, बैकएंड और फुल-स्टैक डेवलपमेंट में मेरे अनुभव को दर्शाते हैं।',
    },
    testimonials: {
      eyebrow: 'शुभकामनाएं',
      heading: 'लोग क्या',
      headingHighlight: 'कहते हैं',
      subtitle:
        'उन क्लाइंट्स और सहयोगियों की प्रतिक्रिया जिनके साथ काम करने का मुझे सौभाग्य मिला है।',
    },
    blog: {
      eyebrow: 'ब्लॉग से',
      heading: 'नवीनतम',
      headingHighlight: 'लेख',
    },
    contact: {
      eyebrow: 'संपर्क करें',
      heading: 'चलिए',
      headingHighlight: 'जुड़ते हैं',
      subtitle:
        'कोई प्रोजेक्ट, अवसर है या बस डेवलपमेंट के बारे में बात करना चाहते हैं? बेझिझक संपर्क करें।',
    },
    footer: {
      quickLinks: 'त्वरित लिंक',
      contact: 'संपर्क',
      resume: 'रिज़्यूमे',
      email: 'ईमेल',
      phone: 'फ़ोन',
      location: 'स्थान',
      rights: 'सर्वाधिकार सुरक्षित।',
      builtWith: 'इनसे बना',
      ctaBadge: 'नए अवसरों के लिए उपलब्ध',
      ctaHeading: 'आइए मिलकर कुछ सार्थक बनाएं।',
      ctaSubtitle:
        'कोई प्रोजेक्ट, अवसर या विचार है? बेझिझक संपर्क करें और बात करते हैं।',
      ctaButton: 'संपर्क करें',
    },
    commandPalette: {
      placeholder: 'कमांड टाइप करें या खोजें...',
      noResults: 'कोई परिणाम नहीं मिला।',
      hint: 'नेविगेट करें',
      hintSelect: 'चुनें',
      hintClose: 'बंद करें',
      groupNavigation: 'नेविगेशन',
      groupActions: 'क्रियाएं',
      goToHome: 'होम पर जाएं',
      goToAbout: 'परिचय पर जाएं',
      goToSkills: 'कौशल पर जाएं',
      goToExperience: 'अनुभव पर जाएं',
      goToProjects: 'प्रोजेक्ट्स पर जाएं',
      goToContact: 'मुझसे संपर्क करें',
      toggleTheme: 'डार्क / लाइट मोड बदलें',
      toggleLanguage: 'भाषा बदलें (English / हिंदी)',
      viewResume: 'रिज़्यूमे देखें',
      openBlog: 'ब्लॉग खोलें',
      adminLogin: 'एडमिन लॉगिन',
    },
    pwa: {
      installTitle: 'यह पोर्टफोलियो इंस्टॉल करें',
      installBody: 'तेज़, ऑफलाइन-फ्रेंडली एक्सेस के लिए इसे होम स्क्रीन पर जोड़ें।',
      installButton: 'इंस्टॉल करें',
      dismissButton: 'अभी नहीं',
      offlineTitle: 'आप ऑफलाइन हैं',
      offlineBody:
        'लगता है आपका इंटरनेट कनेक्शन चला गया है। इस पोर्टफोलियो के कुछ हिस्सों को लोड होने के लिए कनेक्शन चाहिए।',
      offlineRetry: 'फिर से कोशिश करें',
    },
  },
};

export default translations;