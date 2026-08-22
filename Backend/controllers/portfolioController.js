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
| Public:
|   Public portfolio -> complete data
|   Private portfolio -> private response
|
| Admin:
|   Public/private dono condition mein complete portfolio access.
|--------------------------------------------------------------------------
*/

const getPortfolio = async (req, res) => {
  try {
    const portfolio = await getMainPortfolio();

    /*
    |--------------------------------------------------------------------------
    | PORTFOLIO VISIBILITY
    |--------------------------------------------------------------------------
    */

    const visibility =
      portfolio.settings?.portfolioVisibility ||
      'public';

    /*
    |--------------------------------------------------------------------------
    | OPTIONAL ADMIN AUTHENTICATION
    |--------------------------------------------------------------------------
    |
    | /api/portfolio public route hai, isliye protect middleware directly
    | route par nahi laga sakte.
    |
    | Agar Authorization Bearer token available hai to yahan manually
    | verify karke check karenge ki request admin ki hai ya nahi.
    |
    |--------------------------------------------------------------------------
    */

    let isAdmin = false;

    if (
      req.headers.authorization &&
      req.headers.authorization.startsWith('Bearer ')
    ) {
      try {
        const token =
          req.headers.authorization.split(' ')[1];

        const jwt = require('jsonwebtoken');
        const Admin = require('../models/Admin');

        const decoded = jwt.verify(
          token,
          process.env.JWT_SECRET
        );

        const admin = await Admin.findById(
          decoded.id
        ).select('_id');

        if (admin) {
          isAdmin = true;
        }
      } catch (authError) {
        /*
        |--------------------------------------------------------------------------
        | Invalid / Expired Token
        |--------------------------------------------------------------------------
        |
        | Public request ko fail nahi karenge.
        | Is request ko normal visitor treat karenge.
        |
        |--------------------------------------------------------------------------
        */

        isAdmin = false;
      }
    }

    /*
    |--------------------------------------------------------------------------
    | PRIVATE PORTFOLIO
    |--------------------------------------------------------------------------
    |
    | Agar portfolio private hai aur visitor admin nahi hai,
    | to complete portfolio data expose nahi karenge.
    |
    |--------------------------------------------------------------------------
    */

    if (
      visibility === 'private' &&
      !isAdmin
    ) {
      return res.status(200).json({
        success: true,
        message: 'Portfolio is currently private',
        data: {
          isPrivate: true,
          portfolioVisibility: 'private',
        },
      });
    }

    /*
    |--------------------------------------------------------------------------
    | PUBLIC / ADMIN RESPONSE
    |--------------------------------------------------------------------------
    */

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
| UPDATE PORTFOLIO
|--------------------------------------------------------------------------
| PUT /api/portfolio
|
| Admin Dashboard se portfolio information update karega.
|--------------------------------------------------------------------------
*/

const updatePortfolio = async (req, res) => {
  try {
    const {
      hero,
      about,
      contact,
      socialLinks,
      resume,
      seo,
      settings,
      experience,
      education,
    } = req.body;

    const portfolio =
      await getMainPortfolio();

    /*
    |--------------------------------------------------------------------------
    | HERO
    |--------------------------------------------------------------------------
    */

    if (hero !== undefined) {
      portfolio.hero = {
        ...portfolio.hero?.toObject?.(),
        ...hero,
      };
    }

    /*
    |--------------------------------------------------------------------------
    | ABOUT
    |--------------------------------------------------------------------------
    */

    if (about !== undefined) {
      portfolio.about = {
        ...portfolio.about?.toObject?.(),
        ...about,
      };

      /*
      |--------------------------------------------------------------------------
      | CURRENT ROLE
      |--------------------------------------------------------------------------
      */

      if (
        about.currentRole !== undefined
      ) {
        portfolio.about.currentRole = {
          ...portfolio.about.currentRole?.toObject?.(),
          ...about.currentRole,
        };
      }
    }

    /*
    |--------------------------------------------------------------------------
    | CONTACT
    |--------------------------------------------------------------------------
    */

    if (contact !== undefined) {
      portfolio.contact = {
        ...portfolio.contact?.toObject?.(),
        ...contact,
      };
    }

    /*
    |--------------------------------------------------------------------------
    | SOCIAL LINKS
    |--------------------------------------------------------------------------
    */

    if (socialLinks !== undefined) {
      portfolio.socialLinks = {
        ...portfolio.socialLinks?.toObject?.(),
        ...socialLinks,
      };
    }

    /*
    |--------------------------------------------------------------------------
    | RESUME
    |--------------------------------------------------------------------------
    */

    if (resume !== undefined) {
      portfolio.resume = {
        ...portfolio.resume?.toObject?.(),
        ...resume,
      };
    }

    /*
    |--------------------------------------------------------------------------
    | SEO
    |--------------------------------------------------------------------------
    */

    if (seo !== undefined) {
      portfolio.seo = {
        ...portfolio.seo?.toObject?.(),
        ...seo,
      };
    }

    /*
    |--------------------------------------------------------------------------
    | SETTINGS
    |--------------------------------------------------------------------------
    */

    if (settings !== undefined) {
      portfolio.settings = {
        ...portfolio.settings?.toObject?.(),
        ...settings,
      };
    }

    /*
    |--------------------------------------------------------------------------
    | EXPERIENCE
    |--------------------------------------------------------------------------
    */

    if (experience !== undefined) {
      if (!Array.isArray(experience)) {
        return res.status(400).json({
          success: false,
          message:
            'Experience must be an array',
        });
      }

      portfolio.experience =
        experience;
    }

    /*
    |--------------------------------------------------------------------------
    | EDUCATION
    |--------------------------------------------------------------------------
    */

    if (education !== undefined) {
      if (!Array.isArray(education)) {
        return res.status(400).json({
          success: false,
          message:
            'Education must be an array',
        });
      }

      portfolio.education =
        education;
    }

    /*
    |--------------------------------------------------------------------------
    | SAVE
    |--------------------------------------------------------------------------
    */

    await portfolio.save();

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

    if (!Array.isArray(experience)) {
      return res.status(400).json({
        success: false,
        message:
          'Experience must be an array',
      });
    }

    const portfolio =
      await getMainPortfolio();

    portfolio.experience =
      experience;

    await portfolio.save();

    return res.status(200).json({
      success: true,
      message:
        'Experience updated successfully',
      data:
        portfolio.experience,
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

    if (!Array.isArray(education)) {
      return res.status(400).json({
        success: false,
        message:
          'Education must be an array',
      });
    }

    const portfolio =
      await getMainPortfolio();

    portfolio.education =
      education;

    await portfolio.save();

    return res.status(200).json({
      success: true,
      message:
        'Education updated successfully',
      data:
        portfolio.education,
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
      ...portfolio.hero?.toObject?.(),
      ...req.body,
    };

    await portfolio.save();

    return res.status(200).json({
      success: true,
      message:
        'Hero information updated successfully',
      data:
        portfolio.hero,
    });
  } catch (error) {
    console.error(
      'Update Hero Error:',
      error
    );

    return res.status(500).json({
      success: false,
      message:
        'Failed to update hero information',
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

    portfolio.about = {
      ...portfolio.about?.toObject?.(),
      ...req.body,
    };

    /*
    |--------------------------------------------------------------------------
    | CURRENT ROLE
    |--------------------------------------------------------------------------
    */

    if (
      req.body.currentRole !==
      undefined
    ) {
      portfolio.about.currentRole = {
        ...portfolio.about.currentRole?.toObject?.(),
        ...req.body.currentRole,
      };
    }

    await portfolio.save();

    return res.status(200).json({
      success: true,
      message:
        'About information updated successfully',
      data:
        portfolio.about,
    });
  } catch (error) {
    console.error(
      'Update About Error:',
      error
    );

    return res.status(500).json({
      success: false,
      message:
        'Failed to update about information',
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
      ...portfolio.contact?.toObject?.(),
      ...req.body,
    };

    await portfolio.save();

    return res.status(200).json({
      success: true,
      message:
        'Contact information updated successfully',
      data:
        portfolio.contact,
    });
  } catch (error) {
    console.error(
      'Update Contact Error:',
      error
    );

    return res.status(500).json({
      success: false,
      message:
        'Failed to update contact information',
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
      ...portfolio.socialLinks?.toObject?.(),
      ...req.body,
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
      ...portfolio.seo?.toObject?.(),
      ...req.body,
    };

    await portfolio.save();

    return res.status(200).json({
      success: true,
      message:
        'SEO information updated successfully',
      data:
        portfolio.seo,
    });
  } catch (error) {
    console.error(
      'Update SEO Error:',
      error
    );

    return res.status(500).json({
      success: false,
      message:
        'Failed to update SEO information',
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
|
| Supported:
|
| portfolioVisibility
| showAvailabilityBadge
| showGithub
| showLinkedin
| showResume
| showAdminAccess
|
|--------------------------------------------------------------------------
*/

const updateSettings = async (
  req,
  res
) => {
  try {
    const portfolio =
      await getMainPortfolio();

    const {
      portfolioVisibility,
      showAvailabilityBadge,
      showGithub,
      showLinkedin,
      showResume,
      showAdminAccess,
    } = req.body;

    /*
    |--------------------------------------------------------------------------
    | Validate Portfolio Visibility
    |--------------------------------------------------------------------------
    */

    if (
      portfolioVisibility !==
        undefined &&
      !['public', 'private'].includes(
        portfolioVisibility
      )
    ) {
      return res.status(400).json({
        success: false,
        message:
          'Portfolio visibility must be either public or private',
      });
    }

    /*
    |--------------------------------------------------------------------------
    | Existing Settings
    |--------------------------------------------------------------------------
    */

    const existingSettings =
      portfolio.settings?.toObject?.() ||
      {};

    /*
    |--------------------------------------------------------------------------
    | Build Updated Settings
    |--------------------------------------------------------------------------
    */

    const updatedSettings = {
      ...existingSettings,
    };

    /*
    |--------------------------------------------------------------------------
    | Portfolio Visibility
    |--------------------------------------------------------------------------
    */

    if (
      portfolioVisibility !==
      undefined
    ) {
      updatedSettings.portfolioVisibility =
        portfolioVisibility;
    }

    /*
    |--------------------------------------------------------------------------
    | Availability Badge
    |--------------------------------------------------------------------------
    */

    if (
      showAvailabilityBadge !==
      undefined
    ) {
      updatedSettings.showAvailabilityBadge =
        Boolean(
          showAvailabilityBadge
        );
    }

    /*
    |--------------------------------------------------------------------------
    | GitHub
    |--------------------------------------------------------------------------
    */

    if (
      showGithub !==
      undefined
    ) {
      updatedSettings.showGithub =
        Boolean(showGithub);
    }

    /*
    |--------------------------------------------------------------------------
    | LinkedIn
    |--------------------------------------------------------------------------
    */

    if (
      showLinkedin !==
      undefined
    ) {
      updatedSettings.showLinkedin =
        Boolean(showLinkedin);
    }

    /*
    |--------------------------------------------------------------------------
    | Resume
    |--------------------------------------------------------------------------
    */

    if (
      showResume !==
      undefined
    ) {
      updatedSettings.showResume =
        Boolean(showResume);
    }

    /*
    |--------------------------------------------------------------------------
    | Admin Access
    |--------------------------------------------------------------------------
    */

    if (
      showAdminAccess !==
      undefined
    ) {
      updatedSettings.showAdminAccess =
        Boolean(showAdminAccess);
    }

    /*
    |--------------------------------------------------------------------------
    | SAVE SETTINGS
    |--------------------------------------------------------------------------
    */

    portfolio.settings =
      updatedSettings;

    await portfolio.save();

    return res.status(200).json({
      success: true,
      message:
        'Portfolio settings updated successfully',
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
        'Failed to update portfolio settings',
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
    | IMAGE URL
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
      data:
        portfolio,
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
      data:
        portfolio,
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

    /*
    |--------------------------------------------------------------------------
    | DELETE EXISTING
    |--------------------------------------------------------------------------
    */

    await PortfolioContent.deleteOne({
      _id: portfolio._id,
    });

    /*
    |--------------------------------------------------------------------------
    | CREATE FRESH PORTFOLIO
    |--------------------------------------------------------------------------
    */

    const newPortfolio =
      await PortfolioContent.create({
        key: 'main',
      });

    return res.status(200).json({
      success: true,
      message:
        'Portfolio reset successfully',
      data:
        newPortfolio,
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