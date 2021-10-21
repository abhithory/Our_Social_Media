const OurSocialMedia = artifacts.require("OurSocialMedia");

module.exports = function(deployer) {
  deployer.deploy(OurSocialMedia,420,220);
};
