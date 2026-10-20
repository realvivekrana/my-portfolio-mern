const PortfolioContent = require('../models/PortfolioContent');
const { logAudit } = require('../utils/auditLogger');

const {
  PAGE_TEXT_FIELDS,
  PAGE_LIST_FIELDS,
  PAGE_KEYS,
} = require('../utils/pageContentFields');

const {
  sanitizePortfolioMedia,
} = require('../utils/mediaUrl');

/*
|--------------------------------------------------------------------------
| Helper: Get Main Portfolio
|--------------------------------------------------------------------------
*/

const getMainPortfolio = async () => {
  let portfolio = await PortfolioContent.findOne({
    key: 'main',
  });

  if (!portfolio) {
    portfolio = await PortfolioContent.create({
      key: 'main',
    });
  }

  return portfolio;
};

/*
|--------------------------------------------------------------------------
| GET PORTFOLIO
|--------------------------------------------------------------------------
| GET /api/portfolio
|
| Public + Admin dono ke liye portfolio data fetch karega.
|--------------------------------------------------------------------------
*/

const getPortfolio = async (req, res) => {
  try {
    const portfolio = await getMainPortfolio();

    return res.status(200).json({
      success: true,
      message: 'Portfolio data fetched successfully',
      data: sanitizePortfolioMedia(portfolio),
    });
  } catch (error) {
    console.error(
      'Get Portfolio Error:',
      error
    );

    return res.status(500).json({
      success: false,
      message: 'Failed to fetch portfolio data',
      error: error.message,
    });
  }
};

/*
|--------------------------------------------------------------------------
| DYNAMIC OG IMAGE
|--------------------------------------------------------------------------
| GET /api/portfolio/og-image
|
| Social share preview (Facebook/LinkedIn/WhatsApp/Twitter) ke liye
| ek 1200x630 image on-the-fly generate karta hai — Admin Dashboard
| se hero.name / hero.role / profileImage jab bhi update hoga, share
| preview bhi automatically update ho jayega (koi manual re-deploy
| ya static image edit nahi karna padega).
|
| Approach:
|   - Agar Cloudinary profile image maujood hai, us image ke upar
|     Cloudinary ki khud ki text-overlay transformation use karke
|     naam + role likh dete hain, aur 302 redirect kar dete hain
|     us final Cloudinary URL par (Cloudinary hi image generate/
|     cache karta hai — apna server koi image processing nahi karta).
|   - Agar profile image nahi hai (ya URL Cloudinary ka nahi hai),
|     to static fallback OG image par redirect kar dete hain.
|--------------------------------------------------------------------------
*/

const getOgImage = async (
  req,
  res
) => {
  try {
    const portfolio =
      await getMainPortfolio();

    const heroData =
      portfolio.hero?.toObject?.() ||
      portfolio.hero ||
      {};

    const name =
      heroData.name || 'Vivek Kumar Rana';

    const role =
      heroData.role || 'MERN Stack Developer';

    const profileImage =
      heroData.profileImage || '';

    /*
    |----------------------------------------------------------------
    | STATIC FALLBACK
    |----------------------------------------------------------------
    | Frontend/public/og-default.png — jab dynamic image
    | generate na ho paaye.
    |----------------------------------------------------------------
    */

    const fallbackUrl =
      `${process.env.FRONTEND_URL ||
        'https://my-portfolio-mern-mauve.vercel.app'}/og-default.png`;

    const cloudinaryMatch =
      /^https?:\/\/res\.cloudinary\.com\/([^/]+)\/image\/upload\/(?:v\d+\/)?(.+)$/i.exec(
        profileImage
      );

    if (!cloudinaryMatch) {
      return res.redirect(302, fallbackUrl);
    }

    const cloudName = cloudinaryMatch[1];
    const publicPathWithExt = cloudinaryMatch[2];

    /*
    |----------------------------------------------------------------
    | ESCAPE TEXT FOR CLOUDINARY URL OVERLAY
    |----------------------------------------------------------------
    | Cloudinary text overlays URL me hi encode hote hain, isliye
    | commas/slashes waghera escape karna zaroori hai.
    |----------------------------------------------------------------
    */

    const escapeForCloudinary = (text) =>
      encodeURIComponent(text);

    const nameText = escapeForCloudinary(name);
    const roleText = escapeForCloudinary(role);

    /*
    |----------------------------------------------------------------
    | BUILD TRANSFORMATION CHAIN
    |----------------------------------------------------------------
    | 1. Base image ko 1200x630 card me fit + crop + darken.
    | 2. Naam — bada, bold, white text, bottom-left ke paas.
    | 3. Role — chhota, indigo-ish text, naam ke neeche.
    |----------------------------------------------------------------
    */

    const transformation = [
      'w_1200,h_630,c_fill,g_face,q_auto,f_auto',
      'e_brightness:-25',
      `l_text:Arial_64_bold:${nameText},co_white,g_south_west,x_60,y_140`,
      `l_text:Arial_36:${roleText},co_rgb:A5B4FC,g_south_west,x_60,y_80`,
    ].join('/');

    const ogImageUrl =
      `https://res.cloudinary.com/${cloudName}/image/upload/${transformation}/${publicPathWithExt}`;

    res.set(
      'Cache-Control',
      'public, max-age=3600'
    );

    return res.redirect(302, ogImageUrl);
  } catch (error) {
    console.error(
      'OG Image Error:',
      error
    );

    return res.redirect(
      302,
      `${process.env.FRONTEND_URL ||
        'https://my-portfolio-mern-mauve.vercel.app'}/og-default.png`
    );
  }
};

/*
|--------------------------------------------------------------------------
| UPDATE COMPLETE PORTFOLIO
|--------------------------------------------------------------------------
| PUT /api/portfolio
|
| Admin Dashboard se portfolio ke multiple sections update honge.
|--------------------------------------------------------------------------
*/

const updatePortfolio = async (
  req,
  res
) => {
  try {
    const {
      hero,
      about,
      contact,
      socialLinks,
      resume,
      experience,
      education,
      skills,
      seo,
      settings,
    } = req.body;

    const portfolio =
      await getMainPortfolio();

    /*
    |--------------------------------------------------------------------------
    | HERO
    |--------------------------------------------------------------------------
    */

    if (hero) {
      portfolio.hero = {
        ...(
          portfolio.hero?.toObject?.() ||
          {}
        ),
        ...hero,
      };
    }

    /*
    |--------------------------------------------------------------------------
    | ABOUT
    |--------------------------------------------------------------------------
    */

    if (about) {
      const previousAbout =
        portfolio.about?.toObject?.() ||
        {};

      portfolio.about = {
        ...previousAbout,
        ...about,
      };

      /*
      |----------------------------------------------------------------------
      | CURRENT ROLE
      |----------------------------------------------------------------------
      | Purana currentRole overwrite se PEHLE liya hua hai, warna partial
      | update me company/duration jaisi fields kho jaati thi.
      |----------------------------------------------------------------------
      */

      if (about.currentRole) {
        portfolio.about.currentRole = {
          ...(previousAbout.currentRole || {}),
          ...about.currentRole,
        };
      }
    }

    /*
    |--------------------------------------------------------------------------
    | CONTACT
    |--------------------------------------------------------------------------
    */

    if (contact) {
      portfolio.contact = {
        ...(
          portfolio.contact?.toObject?.() ||
          {}
        ),
        ...contact,
      };
    }

    /*
    |--------------------------------------------------------------------------
    | SOCIAL LINKS
    |--------------------------------------------------------------------------
    */

    if (socialLinks) {
      portfolio.socialLinks = {
        ...(
          portfolio.socialLinks?.toObject?.() ||
          {}
        ),
        ...socialLinks,
      };
    }

    /*
    |--------------------------------------------------------------------------
    | RESUME
    |--------------------------------------------------------------------------
    */

    if (resume) {
      /*
      |--------------------------------------------------------------------------
      | FIX: url and fileName are SERVER-AUTHORITATIVE
      |--------------------------------------------------------------------------
      |
      | These two must ONLY ever be set by the actual resume upload
      | endpoint (uploadResume in portfolioUploadController.js), which
      | knows the real Cloudinary public_id and the correct route path.
      |
      | Previously, this endpoint blindly merged whatever the admin's
      | Profile form sent — including a stale/incorrect `url` value
      | left over in the form from before a fix was deployed — and
      | that silently overwrote the correct value on every unrelated
      | "Save Profile" click. This is why the resume kept breaking
      | again even after the upload endpoint was fixed.
      |
      | Client is still allowed to edit `originalName` (display name).
      |
      |--------------------------------------------------------------------------
      */

      const {
        url: _ignoredUrl,
        fileName: _ignoredFileName,
        ...safeResumeFields
      } = resume;

      portfolio.resume = {
        ...(
          portfolio.resume?.toObject?.() ||
          {}
        ),
        ...safeResumeFields,
      };
    }

    /*
    |--------------------------------------------------------------------------
    | EXPERIENCE
    |--------------------------------------------------------------------------
    */

    if (Array.isArray(experience)) {
      portfolio.experience =
        experience.map(
          (item, index) => ({
            role:
              item.role || '',

            company:
              item.company || '',

            duration:
              item.duration || '',

            type:
              item.type ||
              'Full-time',

            location:
              item.location || '',

            description:
              item.description || '',

            responsibilities:
              Array.isArray(
                item.responsibilities
              )
                ? item.responsibilities
                    .filter(Boolean)
                    .map(
                      (
                        responsibility
                      ) => {
                        /*
                        |------------------------------------------------------
                        | Old format support
                        |------------------------------------------------------
                        */

                        if (
                          typeof responsibility ===
                          'string'
                        ) {
                          return {
                            icon: 'code',
                            text:
                              responsibility,
                          };
                        }

                        return {
                          icon:
                            responsibility.icon ||
                            'code',

                          text:
                            responsibility.text ||
                            '',
                        };
                      }
                    )
                : [],

            technologies:
              Array.isArray(
                item.technologies
              )
                ? item.technologies.filter(
                    Boolean
                  )
                : [],

            displayOrder:
              Number.isFinite(
                Number(
                  item.displayOrder
                )
              )
                ? Number(
                    item.displayOrder
                  )
                : index,

            isVisible:
              item.isVisible !== false,
          })
        );
    }

    /*
    |--------------------------------------------------------------------------
    | EDUCATION
    |--------------------------------------------------------------------------
    */

    if (Array.isArray(education)) {
      portfolio.education =
        education.map(
          (item, index) => ({
            degree:
              item.degree || '',

            institution:
              item.institution ||
              '',

            duration:
              item.duration || '',

            status:
              item.status || '',

            description:
              item.description ||
              '',

            highlights:
              Array.isArray(
                item.highlights
              )
                ? item.highlights.filter(
                    Boolean
                  )
                : [],

            icon:
              item.icon ||
              'book',

            displayOrder:
              Number.isFinite(
                Number(
                  item.displayOrder
                )
              )
                ? Number(
                    item.displayOrder
                  )
                : index,

            isVisible:
              item.isVisible !== false,
          })
        );
    }

    /*
    |--------------------------------------------------------------------------
    | SKILLS
    |--------------------------------------------------------------------------
    |
    | Admin Dashboard
    |       ↓
    | PUT /api/portfolio
    |       ↓
    | MongoDB
    |       ↓
    | GET /api/portfolio
    |       ↓
    | Public Skills
    |--------------------------------------------------------------------------
    */

    if (Array.isArray(skills)) {
      portfolio.skills =
        skills.map(
          (
            category,
            categoryIndex
          ) => ({
            title:
              category.title || '',

            description:
              category.description ||
              '',

            icon:
              category.icon ||
              'code',

            displayOrder:
              Number.isFinite(
                Number(
                  category.displayOrder
                )
              )
                ? Number(
                    category.displayOrder
                  )
                : categoryIndex,

            isVisible:
              category.isVisible !==
              false,

            skills:
              Array.isArray(
                category.skills
              )
                ? category.skills.map(
                    (
                      skill,
                      skillIndex
                    ) => ({
                      name:
                        skill.name ||
                        '',

                      icon:
                        skill.icon ||
                        'code',

                      level:
                        skill.level ||
                        'Intermediate',

                      progress:
                        Math.min(
                          100,
                          Math.max(
                            0,
                            Number(
                              skill.progress
                            ) || 0
                          )
                        ),

                      displayOrder:
                        Number.isFinite(
                          Number(
                            skill.displayOrder
                          )
                        )
                          ? Number(
                              skill.displayOrder
                            )
                          : skillIndex,

                      isVisible:
                        skill.isVisible !==
                        false,
                    })
                  )
                : [],
          })
        );
    }

    /*
    |--------------------------------------------------------------------------
    | SEO
    |--------------------------------------------------------------------------
    */

    if (seo) {
      portfolio.seo = {
        ...(
          portfolio.seo?.toObject?.() ||
          {}
        ),
        ...seo,
      };
    }

    /*
    |--------------------------------------------------------------------------
    | SETTINGS
    |--------------------------------------------------------------------------
    */

    if (settings) {
      portfolio.settings = {
        ...(
          portfolio.settings?.toObject?.() ||
          {}
        ),
        ...settings,
      };
    }

    /*
    |--------------------------------------------------------------------------
    | SAVE
    |--------------------------------------------------------------------------
    */

    await portfolio.save();




    /*
    |--------------------------------------------------------------------------
    | AUDIT LOG
    |--------------------------------------------------------------------------
    |
    | Skills sirf reorder ke liye bhi save hote hain (drag-and-drop), isliye
    | usko alag se 'reorder' action ke roop me log karte hain. Baaki sections
    | (hero/about/contact/etc.) jo bheje gaye unko ek generic 'update' me
    | list kar dete hain.
    |
    */

    const updatedSections = [
      hero && 'hero',
      about && 'about',
      contact && 'contact',
      socialLinks && 'socialLinks',
      resume && 'resume',
      experience && 'experience',
      education && 'education',
      seo && 'seo',
      settings && 'settings',
    ].filter(Boolean);

    if (Array.isArray(skills)) {
      await logAudit({
        req,
        action: 'reorder',
        resourceType: 'Skills',
        resourceLabel: 'Skills section updated/reordered',
      });
    }

    if (updatedSections.length > 0) {
      await logAudit({
        req,
        action: 'update',
        resourceType: 'Portfolio',
        resourceLabel: `Sections updated: ${updatedSections.join(', ')}`,
      });
    }
    /*
    |--------------------------------------------------------------------------
    | RESPONSE
    |--------------------------------------------------------------------------
    */

    return res.status(200).json({
      success: true,
      message:
        'Portfolio updated successfully',
      data: portfolio,
    });
  } catch (error) {
    console.error(
      'Update Portfolio Error:',
      error
    );

    return res.status(500).json({
      success: false,
      message:
        'Failed to update portfolio',
      error: error.message,
    });
  }
};

/*
|--------------------------------------------------------------------------
| UPDATE EXPERIENCE
|--------------------------------------------------------------------------
| PUT /api/portfolio/experience
|--------------------------------------------------------------------------
*/

const updateExperience = async (
  req,
  res
) => {
  try {
    const {
      experience,
    } = req.body;

    if (
      !Array.isArray(experience)
    ) {
      return res.status(400).json({
        success: false,
        message:
          'Experience must be an array',
      });
    }

    const portfolio =
      await getMainPortfolio();

    portfolio.experience =
      experience.map(
        (item, index) => ({
          role:
            item.role || '',

          company:
            item.company || '',

          duration:
            item.duration || '',

          type:
            item.type ||
            'Full-time',

          location:
            item.location || '',

          description:
            item.description || '',

          responsibilities:
            Array.isArray(
              item.responsibilities
            )
              ? item.responsibilities
                  .filter(Boolean)
                  .map(
                    (
                      responsibility
                    ) => {
                      if (
                        typeof responsibility ===
                        'string'
                      ) {
                        return {
                          icon: 'code',
                          text:
                            responsibility,
                        };
                      }

                      return {
                        icon:
                          responsibility.icon ||
                          'code',

                        text:
                          responsibility.text ||
                          '',
                      };
                    }
                  )
              : [],

          technologies:
            Array.isArray(
              item.technologies
            )
              ? item.technologies.filter(
                  Boolean
                )
              : [],

          displayOrder:
            Number.isFinite(
              Number(
                item.displayOrder
              )
            )
              ? Number(
                  item.displayOrder
                )
              : index,

          isVisible:
            item.isVisible !== false,
        })
      );

    await portfolio.save();

    return res.status(200).json({
      success: true,
      message:
        'Experience updated successfully',
      data: portfolio.experience,
    });
  } catch (error) {
    console.error(
      'Update Experience Error:',
      error
    );

    return res.status(500).json({
      success: false,
      message:
        'Failed to update experience',
      error: error.message,
    });
  }
};

/*
|--------------------------------------------------------------------------
| UPDATE EDUCATION
|--------------------------------------------------------------------------
| PUT /api/portfolio/education
|--------------------------------------------------------------------------
*/

const updateEducation = async (
  req,
  res
) => {
  try {
    const {
      education,
    } = req.body;

    if (
      !Array.isArray(education)
    ) {
      return res.status(400).json({
        success: false,
        message:
          'Education must be an array',
      });
    }

    const portfolio =
      await getMainPortfolio();

    portfolio.education =
      education.map(
        (item, index) => ({
          degree:
            item.degree || '',

          institution:
            item.institution ||
            '',

          duration:
            item.duration || '',

          status:
            item.status || '',

          description:
            item.description ||
            '',

          highlights:
            Array.isArray(
              item.highlights
            )
              ? item.highlights.filter(
                  Boolean
                )
              : [],

          icon:
            item.icon ||
            'book',

          displayOrder:
            Number.isFinite(
              Number(
                item.displayOrder
              )
            )
              ? Number(
                  item.displayOrder
                )
              : index,

          isVisible:
            item.isVisible !== false,
        })
      );

    await portfolio.save();

    return res.status(200).json({
      success: true,
      message:
        'Education updated successfully',
      data: portfolio.education,
    });
  } catch (error) {
    console.error(
      'Update Education Error:',
      error
    );

    return res.status(500).json({
      success: false,
      message:
        'Failed to update education',
      error: error.message,
    });
  }
};

/*
|--------------------------------------------------------------------------
| UPDATE HERO
|--------------------------------------------------------------------------
| PUT /api/portfolio/hero
|--------------------------------------------------------------------------
*/

const updateHero = async (
  req,
  res
) => {
  try {
    const portfolio =
      await getMainPortfolio();

    portfolio.hero = {
      ...(
        portfolio.hero?.toObject?.() ||
        {}
      ),
      ...(req.body || {}),
    };

    await portfolio.save();

    return res.status(200).json({
      success: true,
      message:
        'Hero updated successfully',
      data: portfolio.hero,
    });
  } catch (error) {
    console.error(
      'Update Hero Error:',
      error
    );

    return res.status(500).json({
      success: false,
      message:
        'Failed to update hero',
      error: error.message,
    });
  }
};

/*
|--------------------------------------------------------------------------
| UPDATE ABOUT
|--------------------------------------------------------------------------
| PUT /api/portfolio/about
|--------------------------------------------------------------------------
*/

const updateAbout = async (
  req,
  res
) => {
  try {
    const portfolio =
      await getMainPortfolio();

    const aboutData =
      req.body || {};

    const previousAbout =
      portfolio.about?.toObject?.() ||
      {};

    portfolio.about = {
      ...previousAbout,
      ...aboutData,
    };

    /*
    |--------------------------------------------------------------------------
    | CURRENT ROLE
    |--------------------------------------------------------------------------
    | Purana currentRole overwrite se pehle liya hua hai (merge bug fix).
    |--------------------------------------------------------------------------
    */

    if (
      aboutData.currentRole
    ) {
      portfolio.about.currentRole = {
        ...(previousAbout.currentRole || {}),
        ...aboutData.currentRole,
      };
    }

    await portfolio.save();

    return res.status(200).json({
      success: true,
      message:
        'About updated successfully',
      data: portfolio.about,
    });
  } catch (error) {
    console.error(
      'Update About Error:',
      error
    );

    return res.status(500).json({
      success: false,
      message:
        'Failed to update about',
      error: error.message,
    });
  }
};

/*
|--------------------------------------------------------------------------
| UPDATE CONTACT
|--------------------------------------------------------------------------
| PUT /api/portfolio/contact
|--------------------------------------------------------------------------
*/

const updateContact = async (
  req,
  res
) => {
  try {
    const portfolio =
      await getMainPortfolio();

    portfolio.contact = {
      ...(
        portfolio.contact?.toObject?.() ||
        {}
      ),
      ...(req.body || {}),
    };

    await portfolio.save();

    return res.status(200).json({
      success: true,
      message:
        'Contact updated successfully',
      data: portfolio.contact,
    });
  } catch (error) {
    console.error(
      'Update Contact Error:',
      error
    );

    return res.status(500).json({
      success: false,
      message:
        'Failed to update contact',
      error: error.message,
    });
  }
};

/*
|--------------------------------------------------------------------------
| UPDATE SOCIAL LINKS
|--------------------------------------------------------------------------
| PUT /api/portfolio/social-links
|--------------------------------------------------------------------------
*/

const updateSocialLinks = async (
  req,
  res
) => {
  try {
    const portfolio =
      await getMainPortfolio();

    portfolio.socialLinks = {
      ...(
        portfolio.socialLinks?.toObject?.() ||
        {}
      ),
      ...(req.body || {}),
    };

    await portfolio.save();

    return res.status(200).json({
      success: true,
      message:
        'Social links updated successfully',
      data:
        portfolio.socialLinks,
    });
  } catch (error) {
    console.error(
      'Update Social Links Error:',
      error
    );

    return res.status(500).json({
      success: false,
      message:
        'Failed to update social links',
      error: error.message,
    });
  }
};

/*
|--------------------------------------------------------------------------
| UPDATE SEO
|--------------------------------------------------------------------------
| PUT /api/portfolio/seo
|--------------------------------------------------------------------------
*/

const updateSEO = async (
  req,
  res
) => {
  try {
    const portfolio =
      await getMainPortfolio();

    portfolio.seo = {
      ...(
        portfolio.seo?.toObject?.() ||
        {}
      ),
      ...(req.body || {}),
    };

    await portfolio.save();

    return res.status(200).json({
      success: true,
      message:
        'SEO updated successfully',
      data: portfolio.seo,
    });
  } catch (error) {
    console.error(
      'Update SEO Error:',
      error
    );

    return res.status(500).json({
      success: false,
      message:
        'Failed to update SEO',
      error: error.message,
    });
  }
};

/*
|--------------------------------------------------------------------------
| UPDATE SITE CONTENT
|--------------------------------------------------------------------------
| PUT /api/portfolio/site-content
|
| About stats / expertise / strengths, footer, chatbot greeting aur
| section visibility update karta hai. Sirf whitelisted fields hi
| accept hote hain.
|--------------------------------------------------------------------------
*/

const cleanText = (value, max = 500) =>
  String(value ?? '').trim().slice(0, max);

const updateSiteContent = async (req, res) => {
  try {
    const portfolio = await getMainPortfolio();
    const body = req.body || {};

    const current =
      portfolio.siteContent?.toObject?.() || portfolio.siteContent || {};

    const next = { ...current };
    const updated = [];

    if (Array.isArray(body.stats)) {
      next.stats = body.stats
        .filter((item) => item && (item.value || item.label))
        .slice(0, 8)
        .map((item, index) => ({
          value: cleanText(item.value, 30),
          label: cleanText(item.label, 60),
          displayOrder: index,
        }));
      updated.push('stats');
    }

    if (Array.isArray(body.expertise)) {
      next.expertise = body.expertise
        .filter((item) => item && item.title)
        .slice(0, 8)
        .map((item, index) => ({
          icon: cleanText(item.icon || 'code', 30),
          title: cleanText(item.title, 100),
          description: cleanText(item.description, 400),
          displayOrder: index,
        }));
      updated.push('expertise');
    }

    if (Array.isArray(body.strengths)) {
      next.strengths = body.strengths
        .map((item) => cleanText(item, 100))
        .filter(Boolean)
        .slice(0, 20);
      updated.push('strengths');
    }

    if (body.footer && typeof body.footer === 'object') {
      next.footer = {
        ...(current.footer || {}),
        ...(body.footer.tagline !== undefined && {
          tagline: cleanText(body.footer.tagline, 200),
        }),
        ...(body.footer.copyrightName !== undefined && {
          copyrightName: cleanText(body.footer.copyrightName, 80),
        }),
      };
      updated.push('footer');
    }

    if (body.chatbotGreeting !== undefined) {
      next.chatbotGreeting = cleanText(body.chatbotGreeting, 300);
      updated.push('chatbotGreeting');
    }

    if (body.sections && typeof body.sections === 'object') {
      const sections = { ...(current.sections || {}) };

      Object.keys(sections).forEach((key) => {
        if (typeof body.sections[key] === 'boolean') {
          sections[key] = body.sections[key];
        }
      });

      next.sections = sections;
      updated.push('sections');
    }

    portfolio.siteContent = next;
    await portfolio.save();

    if (updated.length > 0) {
      await logAudit({
        req,
        action: 'update',
        resourceType: 'Portfolio',
        resourceLabel: `Site content updated: ${updated.join(', ')}`,
      });
    }

    return res.status(200).json({
      success: true,
      message: 'Site content updated successfully',
      data: portfolio.siteContent,
    });
  } catch (error) {
    console.error('Update Site Content Error:', error);

    return res.status(500).json({
      success: false,
      message: 'Failed to update site content',
      error: error.message,
    });
  }
};


/*
|--------------------------------------------------------------------------
| UPDATE PAGE CONTENT
|--------------------------------------------------------------------------
| PUT /api/portfolio/page-content/:page   (page = home | about | skills | contact)
|
| Body: { greeting: '...', techBubbles: [...] }  — sirf whitelisted fields.
| Galat page, galat type ya zyada lambi value par 400 aata hai (500 nahi).
|--------------------------------------------------------------------------
*/

const updatePageContent = async (req, res) => {
  try {
    const { page } = req.params;

    if (!PAGE_KEYS.includes(page)) {
      return res.status(400).json({
        success: false,
        message: `Invalid page. Allowed: ${PAGE_KEYS.join(', ')}`,
      });
    }

    const body = req.body;

    if (!body || typeof body !== 'object' || Array.isArray(body)) {
      return res.status(400).json({
        success: false,
        message: 'Request body must be an object.',
      });
    }

    const textFields = PAGE_TEXT_FIELDS[page];
    const listFields = PAGE_LIST_FIELDS[page] || {};
    const changes = {};

    for (const [field, max] of Object.entries(textFields)) {
      if (body[field] === undefined) continue;

      if (typeof body[field] !== 'string') {
        return res.status(400).json({
          success: false,
          message: `"${field}" must be text.`,
        });
      }

      const value = body[field].trim();

      if (value.length > max) {
        return res.status(400).json({
          success: false,
          message: `"${field}" can be at most ${max} characters.`,
        });
      }

      changes[field] = value;
    }

    for (const [field, rule] of Object.entries(listFields)) {
      if (body[field] === undefined) continue;

      if (!Array.isArray(body[field])) {
        return res.status(400).json({
          success: false,
          message: `"${field}" must be a list.`,
        });
      }

      if (body[field].some((item) => typeof item !== 'string')) {
        return res.status(400).json({
          success: false,
          message: `"${field}" items must be text.`,
        });
      }

      const items = body[field]
        .map((item) => item.trim())
        .filter(Boolean);

      if (items.length > rule.maxItems) {
        return res.status(400).json({
          success: false,
          message: `"${field}" can have at most ${rule.maxItems} items.`,
        });
      }

      if (items.some((item) => item.length > rule.maxLength)) {
        return res.status(400).json({
          success: false,
          message: `"${field}" items can be at most ${rule.maxLength} characters.`,
        });
      }

      changes[field] = items;
    }

    const portfolio = await getMainPortfolio();

    const current =
      portfolio.pageContent?.toObject?.() ||
      portfolio.pageContent ||
      {};

    portfolio.pageContent = {
      ...current,
      [page]: {
        ...(current[page] || {}),
        ...changes,
      },
    };

    await portfolio.save();

    await logAudit({
      req,
      action: 'update',
      resourceType: 'Portfolio',
      resourceLabel: `Page content updated: ${page}`,
    });

    return res.status(200).json({
      success: true,
      message: 'Page content updated successfully',
      data: portfolio.pageContent,
    });
  } catch (error) {
    console.error('Update Page Content Error:', error);

    return res.status(500).json({
      success: false,
      message: 'Failed to update page content',
      error: error.message,
    });
  }
};

/*
|--------------------------------------------------------------------------
| UPDATE SETTINGS
|--------------------------------------------------------------------------
| PUT /api/portfolio/settings
|--------------------------------------------------------------------------
*/

const updateSettings = async (
  req,
  res
) => {
  try {
    const portfolio =
      await getMainPortfolio();

    portfolio.settings = {
      ...(
        portfolio.settings?.toObject?.() ||
        {}
      ),
      ...(req.body || {}),
    };

    await portfolio.save();

    return res.status(200).json({
      success: true,
      message:
        'Settings updated successfully',
      data:
        portfolio.settings,
    });
  } catch (error) {
    console.error(
      'Update Settings Error:',
      error
    );

    return res.status(500).json({
      success: false,
      message:
        'Failed to update settings',
      error: error.message,
    });
  }
};

/*
|--------------------------------------------------------------------------
| UPDATE PROFILE IMAGE
|--------------------------------------------------------------------------
| POST /api/portfolio/profile-image
|--------------------------------------------------------------------------
*/

const updateProfileImage = async (
  req,
  res
) => {
  try {
    const portfolio =
      await getMainPortfolio();

    /*
    |--------------------------------------------------------------------------
    | FILE CHECK
    |--------------------------------------------------------------------------
    */

    if (!req.file) {
      return res.status(400).json({
        success: false,
        message:
          'Profile image is required',
      });
    }

    /*
    |--------------------------------------------------------------------------
    | FILE URL
    |--------------------------------------------------------------------------
    */

    let imageUrl = '';

    if (req.file.path) {
      imageUrl = req.file.path;
    } else if (
      req.file.filename
    ) {
      imageUrl =
        `/uploads/${req.file.filename}`;
    }

    if (!imageUrl) {
      return res.status(400).json({
        success: false,
        message:
          'Unable to determine uploaded image URL',
      });
    }

    /*
    |--------------------------------------------------------------------------
    | SAVE IMAGE
    |--------------------------------------------------------------------------
    */

    portfolio.hero.profileImage =
      imageUrl;

    await portfolio.save();

    return res.status(200).json({
      success: true,
      message:
        'Profile image updated successfully',
      data: {
        profileImage:
          portfolio.hero.profileImage,
      },
    });
  } catch (error) {
    console.error(
      'Update Profile Image Error:',
      error
    );

    return res.status(500).json({
      success: false,
      message:
        'Failed to update profile image',
      error: error.message,
    });
  }
};

/*
|--------------------------------------------------------------------------
| REMOVE PROFILE IMAGE
|--------------------------------------------------------------------------
| DELETE /api/portfolio/profile-image
|--------------------------------------------------------------------------
*/

const removeProfileImage = async (
  req,
  res
) => {
  try {
    const portfolio =
      await getMainPortfolio();

    portfolio.hero.profileImage =
      '';

    await portfolio.save();

    return res.status(200).json({
      success: true,
      message:
        'Profile image removed successfully',
      data: {
        profileImage:
          portfolio.hero.profileImage,
      },
    });
  } catch (error) {
    console.error(
      'Remove Profile Image Error:',
      error
    );

    return res.status(500).json({
      success: false,
      message:
        'Failed to remove profile image',
      error: error.message,
    });
  }
};

/*
|--------------------------------------------------------------------------
| RESET PORTFOLIO
|--------------------------------------------------------------------------
| POST /api/portfolio/reset
|--------------------------------------------------------------------------
*/

const resetPortfolio = async (
  req,
  res
) => {
  try {
    const portfolio =
      await getMainPortfolio();

    await PortfolioContent.deleteOne({
      _id: portfolio._id,
    });

    const newPortfolio =
      await PortfolioContent.create({
        key: 'main',
      });

    return res.status(200).json({
      success: true,
      message:
        'Portfolio reset successfully',
      data: newPortfolio,
    });
  } catch (error) {
    console.error(
      'Reset Portfolio Error:',
      error
    );

    return res.status(500).json({
      success: false,
      message:
        'Failed to reset portfolio',
      error: error.message,
    });
  }
};

/*
|--------------------------------------------------------------------------
| DELETE PORTFOLIO
|--------------------------------------------------------------------------
| DELETE /api/portfolio
|--------------------------------------------------------------------------
*/

const deletePortfolio = async (
  req,
  res
) => {
  try {
    const portfolio =
      await PortfolioContent.findOne({
        key: 'main',
      });

    if (!portfolio) {
      return res.status(404).json({
        success: false,
        message:
          'Portfolio not found',
      });
    }

    await PortfolioContent.deleteOne({
      _id: portfolio._id,
    });

    return res.status(200).json({
      success: true,
      message:
        'Portfolio deleted successfully',
    });
  } catch (error) {
    console.error(
      'Delete Portfolio Error:',
      error
    );

    return res.status(500).json({
      success: false,
      message:
        'Failed to delete portfolio',
      error: error.message,
    });
  }
};

/*
|--------------------------------------------------------------------------
| EXPORTS
|--------------------------------------------------------------------------
*/

module.exports = {
  getPortfolio,
  getOgImage,

  updatePortfolio,

  updateExperience,
  updateEducation,

  updateHero,
  updateAbout,
  updateContact,
  updateSocialLinks,
  updateSEO,
  updateSettings,
  updateSiteContent,
  updatePageContent,

  updateProfileImage,
  removeProfileImage,

  resetPortfolio,
  deletePortfolio,
};