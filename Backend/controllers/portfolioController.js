const PortfolioContent = require('../models/PortfolioContent');

/*
|--------------------------------------------------------------------------
| Helper: Get Main Portfolio
|--------------------------------------------------------------------------
*/

const getMainPortfolio = async () => {
  let portfolio = await PortfolioContent.findOne({ key: 'main' });

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
    console.error('Get Portfolio Error:', error);

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
| Admin Dashboard se profile information update karega.
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
    } = req.body;

    const portfolio = await getMainPortfolio();

    /*
    |--------------------------------------------------------------------------
    | HERO
    |--------------------------------------------------------------------------
    */

    if (hero) {
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

    if (about) {
      portfolio.about = {
        ...portfolio.about?.toObject?.(),
        ...about,
      };

      /*
      | Current Role is a nested object
      */

      if (about.currentRole) {
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

    if (contact) {
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

    if (socialLinks) {
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

    if (resume) {
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

    if (seo) {
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

    if (settings) {
      portfolio.settings = {
        ...portfolio.settings?.toObject?.(),
        ...settings,
      };
    }

    await portfolio.save();

    return res.status(200).json({
      success: true,
      message: 'Portfolio updated successfully',
      data: portfolio,
    });
  } catch (error) {
    console.error('Update Portfolio Error:', error);

    return res.status(500).json({
      success: false,
      message: 'Failed to update portfolio',
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

const updateProfileImage = async (req, res) => {
  try {
    const portfolio = await getMainPortfolio();

    /*
    |--------------------------------------------------------------------------
    | File Check
    |--------------------------------------------------------------------------
    */

    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: 'Profile image is required',
      });
    }

    /*
    |--------------------------------------------------------------------------
    | File URL
    |--------------------------------------------------------------------------
    |
    | Multer ke according file.path / filename available ho sakta hai.
    |
    */

    let imageUrl = '';

    if (req.file.path) {
      imageUrl = req.file.path;
    } else if (req.file.filename) {
      imageUrl = `/uploads/${req.file.filename}`;
    }

    if (!imageUrl) {
      return res.status(400).json({
        success: false,
        message: 'Unable to determine uploaded image URL',
      });
    }

    /*
    |--------------------------------------------------------------------------
    | Save Image
    |--------------------------------------------------------------------------
    */

    portfolio.hero.profileImage = imageUrl;

    await portfolio.save();

    return res.status(200).json({
      success: true,
      message: 'Profile image updated successfully',
      data: portfolio,
    });
  } catch (error) {
    console.error('Update Profile Image Error:', error);

    return res.status(500).json({
      success: false,
      message: 'Failed to update profile image',
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

const removeProfileImage = async (req, res) => {
  try {
    const portfolio = await getMainPortfolio();

    portfolio.hero.profileImage = '';

    await portfolio.save();

    return res.status(200).json({
      success: true,
      message: 'Profile image removed successfully',
      data: portfolio,
    });
  } catch (error) {
    console.error('Remove Profile Image Error:', error);

    return res.status(500).json({
      success: false,
      message: 'Failed to remove profile image',
      error: error.message,
    });
  }
};

/*
|--------------------------------------------------------------------------
| RESET PORTFOLIO
|--------------------------------------------------------------------------
| Agar future me Admin ko complete profile reset karna ho,
| to ye endpoint useful rahega.
|--------------------------------------------------------------------------
*/

const resetPortfolio = async (req, res) => {
  try {
    const portfolio = await getMainPortfolio();

    /*
    | Default values restore karne ke liye existing document
    | ko delete karke fresh document create kar rahe hain.
    */

    await PortfolioContent.deleteOne({
      _id: portfolio._id,
    });

    const newPortfolio = await PortfolioContent.create({
      key: 'main',
    });

    return res.status(200).json({
      success: true,
      message: 'Portfolio reset successfully',
      data: newPortfolio,
    });
  } catch (error) {
    console.error('Reset Portfolio Error:', error);

    return res.status(500).json({
      success: false,
      message: 'Failed to reset portfolio',
      error: error.message,
    });
  }
};

/*
|--------------------------------------------------------------------------
| DELETE PORTFOLIO DATA
|--------------------------------------------------------------------------
| Complete portfolio document delete karega.
|--------------------------------------------------------------------------
| Isko Admin Dashboard se directly expose karna zaroori nahi hai.
|--------------------------------------------------------------------------
*/

const deletePortfolio = async (req, res) => {
  try {
    const portfolio = await PortfolioContent.findOne({
      key: 'main',
    });

    if (!portfolio) {
      return res.status(404).json({
        success: false,
        message: 'Portfolio not found',
      });
    }

    await PortfolioContent.deleteOne({
      _id: portfolio._id,
    });

    return res.status(200).json({
      success: true,
      message: 'Portfolio deleted successfully',
    });
  } catch (error) {
    console.error('Delete Portfolio Error:', error);

    return res.status(500).json({
      success: false,
      message: 'Failed to delete portfolio',
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
  updateProfileImage,
  removeProfileImage,
  resetPortfolio,
  deletePortfolio,
};