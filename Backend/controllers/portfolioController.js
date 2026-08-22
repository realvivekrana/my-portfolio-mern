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
    const portfolio =
      await getMainPortfolio();

    return res.status(200).json({
      success: true,
      message:
        'Portfolio data fetched successfully',
      data: portfolio,
    });
  } catch (error) {
    console.error(
      'Get Portfolio Error:',
      error
    );

    return res.status(500).json({
      success: false,
      message:
        'Failed to fetch portfolio data',
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
        about.currentRole !==
        undefined
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

    if (
      socialLinks !== undefined
    ) {
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

    if (
      settings !== undefined
    ) {
      portfolio.settings = {
        ...portfolio.settings?.toObject?.(),
        ...settings,
      };
    }

    /*
    |--------------------------------------------------------------------------
    | EXPERIENCE
    |--------------------------------------------------------------------------
    |
    | Experience array ko completely replace/update karega.
    |
    */

    if (
      experience !== undefined
    ) {
      if (
        !Array.isArray(experience)
      ) {
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
    |
    | Education array ko completely replace/update karega.
    |
    */

    if (
      education !== undefined
    ) {
      if (
        !Array.isArray(education)
      ) {
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
|
| Admin ke Experience Manager ke liye.
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

    /*
    |--------------------------------------------------------------------------
    | Validate Experience
    |--------------------------------------------------------------------------
    */

    if (
      !Array.isArray(experience)
    ) {
      return res.status(400).json({
        success: false,
        message:
          'Experience must be an array',
      });
    }

    /*
    |--------------------------------------------------------------------------
    | Get Portfolio
    |--------------------------------------------------------------------------
    */

    const portfolio =
      await getMainPortfolio();

    /*
    |--------------------------------------------------------------------------
    | Update Experience
    |--------------------------------------------------------------------------
    */

    portfolio.experience =
      experience;

    /*
    |--------------------------------------------------------------------------
    | Save
    |--------------------------------------------------------------------------
    */

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
|
| Admin ke Education Manager ke liye.
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

    /*
    |--------------------------------------------------------------------------
    | Validate Education
    |--------------------------------------------------------------------------
    */

    if (
      !Array.isArray(education)
    ) {
      return res.status(400).json({
        success: false,
        message:
          'Education must be an array',
      });
    }

    /*
    |--------------------------------------------------------------------------
    | Get Portfolio
    |--------------------------------------------------------------------------
    */

    const portfolio =
      await getMainPortfolio();

    /*
    |--------------------------------------------------------------------------
    | Update Education
    |--------------------------------------------------------------------------
    */

    portfolio.education =
      education;

    /*
    |--------------------------------------------------------------------------
    | Save
    |--------------------------------------------------------------------------
    */

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
    | Current Role
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
*/

const updateSettings = async (
  req,
  res
) => {
  try {
    const portfolio =
      await getMainPortfolio();

    portfolio.settings = {
      ...portfolio.settings?.toObject?.(),
      ...req.body,
    };

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
| Profile image upload hone ke baad image URL MongoDB me save karega.
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
    | File Check
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
    | Determine Image URL
    |--------------------------------------------------------------------------
    */

    let imageUrl = '';

    if (req.file.path) {
      imageUrl = req.file.path;
    } else if (req.file.filename) {
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
    | Save Image
    |--------------------------------------------------------------------------
    */

    portfolio.hero.profileImage =
      imageUrl;

    await portfolio.save();

    return res.status(200).json({
      success: true,
      message:
        'Profile image updated successfully',
      data: portfolio,
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
| MongoDB se profile image URL remove karega.
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
      data: portfolio,
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
| Complete portfolio ko default values par reset karega.
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
    | Delete Existing Portfolio
    |--------------------------------------------------------------------------
    */

    await PortfolioContent.deleteOne({
      _id: portfolio._id,
    });

    /*
    |--------------------------------------------------------------------------
    | Create Fresh Portfolio
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
| Complete portfolio document delete karega.
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