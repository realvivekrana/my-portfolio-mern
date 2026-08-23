const PortfolioContent = require('../models/PortfolioContent');

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
      data: portfolio,
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
      portfolio.about = {
        ...(
          portfolio.about?.toObject?.() ||
          {}
        ),
        ...about,
      };

      /*
      |----------------------------------------------------------------------
      | CURRENT ROLE
      |----------------------------------------------------------------------
      */

      if (about.currentRole) {
        portfolio.about.currentRole = {
          ...(
            portfolio.about.currentRole?.toObject?.() ||
            {}
          ),
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

    portfolio.about = {
      ...(
        portfolio.about?.toObject?.() ||
        {}
      ),
      ...aboutData,
    };

    /*
    |--------------------------------------------------------------------------
    | CURRENT ROLE
    |--------------------------------------------------------------------------
    */

    if (
      aboutData.currentRole
    ) {
      portfolio.about.currentRole = {
        ...(
          portfolio.about.currentRole?.toObject?.() ||
          {}
        ),
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

  updatePortfolio,

  updateExperience,
  updateEducation,

  updateHero,
  updateAbout,
  updateContact,
  updateSocialLinks,
  updateSEO,
  updateSettings,

  updateProfileImage,
  removeProfileImage,

  resetPortfolio,
  deletePortfolio,
};