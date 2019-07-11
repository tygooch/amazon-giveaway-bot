export const UI_TEMPLATE = `
<style>
  input:not([type='checkbox']) {
    width: 250px;
    box-shadow: 0 0 0 100px #fff inset !important;
    border: 1px solid rgb(206, 212, 218) !important;
  }

  .botNavLink {
    /* all: unset; */
    background-color: transparent;
    text-decoration: none !important;
    /* border-bottom: none; */
    /* border-left: 1px solid transparent; */
    /* border-right: 1px solid transparent;
    border-top: 1px solid transparent; */
    border-bottom: 1px solid #ccc;
    padding: 10px;
    font-size: 1rem;
    outline: 0 !important;
    flex: 1;
    text-align: center;
    color: #777;
    /* box-shadow: 0 -1px 0 #ccc inset; */
  }

  .botNavLink:first-child {
    /* border-radius: .28571429rem 0 0 0; */
  }

  .botNavLink.active {
    position: relative;
    /* top: 1px; */
    color: #111;
    /* box-shadow: 0 -1px 0 #F58B1F inset; */
    background-color: #fff;
    font-weight: 500;
    /* border-top-width: 1px; */
    border: 1px solid #ccc;
    /* border-color: #ccc; */
    /* margin-bottom: -1px; */
    border-bottom: 1px solid transparent;
    /* box-shadow: none; */
    border-radius: .28571429rem .28571429rem 0 0 !important;
  }

  .botPanel {
    position: relative;
    background-color: transparent;
    width: 100%;
    display: none;
    flex-direction: column;
    padding: 7px 16px;
    height: 400px;
    width: 600px;
    text-align: left;
    overflow-y: scroll;
    overflow-x: hidden;
    border: 1px solid #ccc;
    border-top: 0;
  }

  .botPanel.active {
    display: block;
  }

  #winningsList.active {
    display: flex;
  }

</style>

<div id="controlPanel" style="position: fixed; top: 0px; left: 0px; width: 100vw; height: 100vh; display: flex; flex-direction: column; justify-content: center; background:#000; z-index: 9999;">
  <div id="container" style="font-family: 'Helvetica Neue', Arial, sans-serif; overflow: hidden; position: relative; min-width: 600px; margin: auto auto; color: #212529; background-color: #fff; border: 0px solid transparent; border-radius: .28571429rem; z-index: 9999; text-align: left; display: flex; flex-direction: column; justify-content: space-between;">
    <div style="position: relative; border-bottom: 0px solid #ddd; margin-top: 0; text-align: center;">
      <img style="width: 600px;" src="https://svgshare.com/i/Dwc.svg" />
    </div>

    <div style="display: flex; background-color: transparent; margin-bottom: 0px; background: #fff; z-index: 1;">
      <a target="#botOptions" id="showOptions" class="botNavLink active">
        Settings
      </a>
      <a target="#log" id="showLog" class="botNavLink">
        Activity Log
      </a>
      <a target="#botFrameContainer" id="showBotFrame" class="botNavLink">
        Browser
      </a>
      <a target="#winningsList" id="showWinnings" class="botNavLink">
        Winnings
      </a>
      <!-- <span class="botNavLink" style="flex: 1;"></span> -->
      <!-- <div style="flex: 1; display:flex; flex-direction: column; justify-content: space-between; padding: 10px; border-top: 0px solid #ccc; border-bottom: 1px solid #ccc; background: #fff;">
      </div> -->
    </div>

    <div id="botOptions" class="botPanel active">
      <div style="font-size: 17px; font-weight: 700; margin-bottom: 10px; border-bottom: 1px solid #eee;">
        Amazon Account
      </div>
      <div style="display: flex; padding-bottom:10px;">
        <div style="display: flex; flex-direction: column;">
          <div style="padding-bottom: 10px;"><label for="amazonEmail">Email</label><input id="amazonEmail" name="amazonEmail" type="text" placeholdertype="Amazon Email" class="required" /></div>
        </div>
        <div style="padding-left: 10px;"><label for="amazonPassword">Passsword</label><input id="amazonPassword" name="amazonPassword" type="password" placeholdertype="Amazon Password" class="required" /></div>
      </div>
      <div style="font-size: 17px; font-weight: 700; margin-bottom: 10px; border-bottom: 1px solid #eee;">Captcha Solving</div>
      <div style="padding-bottom: 20px;"><label for="twoCaptchaKey">2Captcha Key <a style="font-weight: 400;" href="https://2captcha.com?from=7493321">(referral link)</a></label><input id="twoCaptchaKey" style="width: 250px; box-shadow: 0 0 0 100px #fff inset !important;" name="twoCaptchaKey" type="text" placeholdertype="Enter your key here" /></div>
      <div style="font-size: 17px; font-weight: 700; margin-bottom: 10px; border-bottom: 1px solid #eee;">Giveaway Filter</div>
      <div style="display: flex; padding-bottom:10px;">
        <div style="display: flex; flex-direction: column;">
          <div style="padding-bottom: 10px;">
            <div><input id="disableFollow" name="disableFollow" type="checkbox" /><span> Requires Follow</span></div>
            <div><input id="disableKindle" name="disableKindle" type="checkbox" /><span> Kindle Books</span></div>
          </div>
        </div>
      </div>
      <div style="font-size: 17px; font-weight: 700; border-bottom: 1px solid #eee;">Shipping Address</div>
      <div id="addressForm" style="display: flex; flex-direction: column;">
        <div style="padding: 10px 0px;"><label for="fullName">Full Name</label><input id="fullName" name="fullName" type="text" class="required" /></div>
        <div style="padding-bottom: 10px;"><label for="street1">Street Address</label><input id="street1" name="street1" type="text" class="required" placeholder="Street and number, P.O. box, c/o." /></div>
        <div style="padding-bottom: 10px;"><input id="street2" name="street2" type="text" placeholder="Apartment, suite, unit, building, floor, etc." /></div>
        <div style="padding-bottom: 10px;"><label for="city">City</label><input id="city" name="city" type="text" class="required" /></div>
        <div style="padding-bottom: 10px;"><label for="state">State / Province / Region</label><input id="state" name="state" type="text" class="required" /></div>
        <div style="padding-bottom: 10px;"><label for="zip">Zip Code</label><input id="zip" name="zip" type="text" class="required" /></div>
        <div style="padding-bottom: 10px;"><label for="phone">Phone number</label><input id="phone" name="phone" type="text" class="required" /></div>
      </div>
    </div>

    <div id="log" class="botPanel" style="padding: 0px;">
      <div id="logContent" style="display: flex; flex-direction: column; padding: 0px 16px; text-align: left; overflow: scroll; height: 399px; max-height: 399px;"></div>
      <button id="clearLog" style="display: none; position: absolute; bottom: 5px; right: 10px; width: 50px;">Clear</button>
      <a><svg id="autoscroll" style="display: none; position: absolute; bottom: 5px; left: calc(50% - 25px);" class="a" xmlns="http://www.w3.org/2000/svg" width="25" height="25" viewBox="0 0 25 25"><defs><style>.cls-1{fill:#2196f3;}.cls-2{fill:#fff;}</style></defs><title>Untitled-1</title><circle class="cls-1" cx="12.5" cy="12.5" r="12.5"/><path class="cls-2" d="M20.5,12.5l-1.4-1.41-5.6,5.58V4.5h-2V16.67L5.93,11.08,4.5,12.5l8,8Z" transform="translate(0 0)"/></svg></a>
    </div>

    <div id="botFrameContainer" class="botPanel" style="padding: 0px;">
      <iframe id="botFrame" style="width: 1200px; height: 800px; transform: scale(0.5); transform-origin: top left; border: 0;" src="https://www.amazon.com/ga/giveaways"></iframe>
    </div>

    <div id="winningsList" class="botPanel" style="padding: 16px;">

    </div>

    <div style=" border-top: 0px solid #ddd; background-color: #fff; display: flex; justify-content: space-between; padding: 10px 16px; text-align: left;">
      <div style=" display:flex; flex-direction: column;">
        <span style="display: flex;" id="lifetimeEntries"><b>Giveaways Entered: </b><span style="margin: 0px 5px;" id="lifetimeEntriesValue"></span><span id="currentSessionEntries"></span></span>
        <span style="display: flex;" id="totalWins"><b>Giveaways Won: </b><span style="margin: 0px 5px;" id="totalWinsValue"></span><span id="currentSessionWins"></span></span>
      </div>
      <button id="run" style="background-color: #2185d0; border: 0; border-radius: .28571429rem; color: #fff; padding: .78571429em 1.5em; min-height: 1em; line-height: 1em; font-size: 1rem;">Start Bot</button>
      <button id="stop" style="display: none; background-color: #d10919; border: 0; border-radius: .28571429rem; color: #fff;  padding: .78571429em 1.5em; min-height: 1em; line-height: 1em; font-size: 1rem;">Stop Bot</button>
    </div>
  </div>
</div>
`
