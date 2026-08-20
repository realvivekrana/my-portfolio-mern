const PortfolioContent = require('../models/PortfolioContent');

/*
|--------------------------------------------------------------------------
| Get Portfolio Content
|--------------------------------------------------------------------------
| @route   GET /api/portfolio
| @access  Public
|
| Public portfolio frontend isi API se dynamic content fetch karega.
|--------------------------------------------------------------------------
*/

const getPortfolio = async (req, res) => {
  try {
    let portfolio = await PortfolioContent.findOne({
      key: 'main',
    });

    /*
    |--------------------------------------------------------------------------
    | Create Default Portfolio Document If It Doesn't Exist
    |--------------------------------------------------------------------------
    */

    if (!portfolio) {
      portfolio = await PortfolioContent.create({
        key: 'main',
      });
    }

    res.status(200).json({
      success: true,
      message: 'Portfolio content fetched successfully',
      data: portfolio,
    });
  } catch (error) {
    console.error('Get Portfolio Error:', error);

    res.status(500).json({
      success: false,
      message: 'Failed to fetch portfolio content',
      error: error.message,
    });
  }
};

/*
|--------------------------------------------------------------------------
| Update Portfolio Content
|--------------------------------------------------------------------------
| @route   PUT /api/portfolio
| @access  Protected Admin
|
| Admin Dashboard se portfolio content update hoga.
|--------------------------------------------------------------------------
*/

const updatePortfolio = async (req, res) => {
  try {
    /*
    |--------------------------------------------------------------------------
    | Find Existing Portfolio
    |--------------------------------------------------------------------------
    */

    let portfolio = await PortfolioContent.findOne({
      key: 'main',
    });

    /*
    |--------------------------------------------------------------------------
    | Create If Not Found
    |--------------------------------------------------------------------------
    */

    if (!portfolio) {
      portfolio = new PortfolioContent({
        key: 'main',
      });
    }

    /*
    |--------------------------------------------------------------------------
    | HERO
    |--------------------------------------------------------------------------
    */

    if (req.body.hero) {
      const hero = req.body.hero;

      if (hero.name !== undefined) {
        portfolio.hero.name = hero.name;
      }

      if (hero.role !== undefined) {
        portfolio.hero.role = hero.role;
      }

      if (hero.tagline !== undefined) {
        portfolio.hero.tagline = hero.tagline;
      }

      if (hero.profileImage !== undefined) {
        portfolio.hero.profileImage =
          hero.profileImage;
      }

      if (hero.availability !== undefined) {
        portfolio.hero.availability =
          hero.availability;
      }

      if (hero.githubUrl !== undefined) {
        portfolio.hero.githubUrl =
          hero.githubUrl;
      }

      if (hero.linkedinUrl !== undefined) {
        portfolio.hero.linkedinUrl =
          hero.linkedinUrl;
      }
    }

    /*
    |--------------------------------------------------------------------------
    | ABOUT
    |--------------------------------------------------------------------------
    */

    if (req.body.about) {
      const about = req.body.about;

      if (about.shortDescription !== undefined) {
        portfolio.about.shortDescription =
          about.shortDescription;
      }

      if (about.introduction !== undefined) {
        portfolio.about.introduction =
          about.introduction;
      }

      if (about.specialization !== undefined) {
        portfolio.about.specialization =
          about.specialization;
      }

      if (about.careerGoal !== undefined) {
        portfolio.about.careerGoal =
          about.careerGoal;
      }

      /*
      |--------------------------------------------------------------------------
      | CURRENT ROLE
      |--------------------------------------------------------------------------
      */

      if (about.currentRole) {
        if (
          about.currentRole.role !==
          undefined
        ) {
          portfolio.about.currentRole.role =
            about.currentRole.role;
        }

        if (
          about.currentRole.company !==
          undefined
        ) {
          portfolio.about.currentRole.company =
            about.currentRole.company;
        }

        if (
          about.currentRole.duration !==
          undefined
        ) {
          portfolio.about.currentRole.duration =
            about.currentRole.duration;
        }

        if (
          about.currentRole.description !==
          undefined
        ) {
          portfolio.about.currentRole.description =
            about.currentRole.description;
        }
      }
    }

    /*
    |--------------------------------------------------------------------------
    | CONTACT
    |--------------------------------------------------------------------------
    */

    if (req.body.contact) {
      const contact = req.body.contact;

      if (contact.email !== undefined) {
        portfolio.contact.email =
          contact.email;
      }

      if (contact.phone !== undefined) {
        portfolio.contact.phone =
          contact.phone;
      }

      if (contact.location !== undefined) {
        portfolio.contact.location =
          contact.location;
      }
    }

    /*
    |--------------------------------------------------------------------------
    | SOCIAL LINKS
    |--------------------------------------------------------------------------
    */

    if (req.body.socialLinks) {
      const socialLinks =
        req.body.socialLinks;

      if (socialLinks.github !== undefined) {
        portfolio.socialLinks.github =
          socialLinks.github;
      }

      if (
        socialLinks.linkedin !==
        undefined
      ) {
        portfolio.socialLinks.linkedin =
          socialLinks.linkedin;
      }

      if (socialLinks.email !== undefined) {
        portfolio.socialLinks.email =
          socialLinks.email;
      }
    }

    /*
    |--------------------------------------------------------------------------
    | RESUME
    |--------------------------------------------------------------------------
    */

    if (req.body.resume) {
      const resume = req.body.resume;

      if (resume.url !== undefined) {
        portfolio.resume.url =
          resume.url;
      }

      if (
        resume.fileName !==
        undefined
      ) {
        portfolio.resume.fileName =
          resume.fileName;
      }

      if (
        resume.originalName !==
        undefined
      ) {
        portfolio.resume.originalName =
          resume.originalName;
      }

      if (
        resume.uploadedAt !==
        undefined
      ) {
        portfolio.resume.uploadedAt =
          resume.uploadedAt;
      }
    }

    /*
    |--------------------------------------------------------------------------
    | SEO
    |--------------------------------------------------------------------------
    */

    if (req.body.seo) {
      const seo = req.body.seo;

      if (seo.title !== undefined) {
        portfolio.seo.title =
          seo.title;
      }

      if (
        seo.description !==
        undefined
      ) {
        portfolio.seo.description =
          seo.description;
      }

      if (
        seo.keywords !==
        undefined
      ) {
        portfolio.seo.keywords =
          seo.keywords;
      }

      if (
        seo.ogImage !==
        undefined
      ) {
        portfolio.seo.ogImage =
          seo.ogImage;
      }
    }

    /*
    |--------------------------------------------------------------------------
    | SETTINGS
    |--------------------------------------------------------------------------
    */

    if (req.body.settings) {
      const settings =
        req.body.settings;

      if (
        settings.showAvailabilityBadge !==
        undefined
      ) {
        portfolio.settings.showAvailabilityBadge =
          settings.showAvailabilityBadge;
      }

      if (
        settings.showGithub !==
        undefined
      ) {
        portfolio.settings.showGithub =
          settings.showGithub;
      }

      if (
        settings.showLinkedin !==
        undefined
      ) {
        portfolio.settings.showLinkedin =
          settings.showLinkedin;
      }

      if (
        settings.showResume !==
        undefined
      ) {
        portfolio.settings.showResume =
          settings.showResume;
      }

      if (
        settings.showAdminAccess !==
        undefined
      ) {
        portfolio.settings.showAdminAccess =
          settings.showAdminAccess;
      }
    }

    /*
    |--------------------------------------------------------------------------
    | Save Changes
    |--------------------------------------------------------------------------
    */

    const updatedPortfolio =
      await portfolio.save();

    res.status(200).json({
      success: true,
      message:
        'Portfolio content updated successfully',
      data: updatedPortfolio,
    });
  } catch (error) {
    console.error(
      'Update Portfolio Error:',
      error
    );

    res.status(500).json({
      success: false,
      message:
        'Failed to update portfolio content',
      error: error.message,
    });
  }
};

module.exports = {
  getPortfolio,
  updatePortfolio,
};