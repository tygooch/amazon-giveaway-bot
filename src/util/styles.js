export const STYLES = `
<style>
  #giveawayFilter div * {
    cursor: pointer !important;
  }

  input:not([type='checkbox']) {
    width: 100%;
    box-shadow: 0 0 0 100px #fff inset !important;
    border: 1px solid rgb(206, 212, 218) !important;
  }

  :focus{
    outline: 0;
  }

  select {
    width: 100%;
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
  
  #log.active {
    display: flex;
    flex-direction: column;
  }

  #winningsList.active {
    display: flex;
  }

  #logContent > div {
    
    padding: 0px 16px;
  }

  #logContent > div:nth-child(-n+17) {
    border-bottom: 1px solid #eee;
  }
  #logContent > div:nth-child(n+19) {
    border-top: 1px solid #eee;
  }

  #logContent::-webkit-scrollbar {
    width: 5px;
    background: #eee;
  }
  
  #logContent::-webkit-scrollbar-thumb {
    background-color: #C1C1C1;
    border-color: transparent;
    border-style: solid;
    box-shadow: 0 0 1px rgba(255, 255, 255, 0.5);
  }
  
  #logContent::-webkit-scrollbar-thumb:hover {
    background-color: rgba(0, 0, 0, 0.5);
  }

  /* Global body style */
  body {
    overflow-anchor: none;
  }

  /* Global footer style */
  #navFooter {
    margin-top: 0 !important;
  }

  #navFooter .navFooterLogoLine {
    margin-top: 7px !important;
  }

  /* AAE - Amazon Accessibility Evaluator style */
  .a-disabled {
    color: #6c7778 !important;
  }

  .tropical {
    color: #e31f64;
  }

  .ellipse-1-line {
    display: block;
    display: -webkit-box;
    -webkit-line-clamp: 1;
    -webkit-box-orient: vertical;
    overflow: hidden;
    text-overflow: ellipsis;
    overflow-wrap: break-word;
    min-height: 20px;
    max-height: 20px;
  }

  .ellipse-2-line {
    display: block;
    display: -webkit-box;
    -webkit-line-clamp: 2;
    -webkit-box-orient: vertical;
    overflow: hidden;
    text-overflow: ellipsis;
    overflow-wrap: break-word;
    min-height: 40px;
    max-height: 40px;
  }

  .listing-page {
    font-family: Amazon Ember, Arial, sans-serif;
  }

  .listing-page .listing-desktop {
    min-width: 1000px;
  }

  .listing-page .banner-link,
  .listing-page .banner-link:hover {
    text-decoration: none;
  }

  .listing-info-mobile .listing-info-container {
    margin: 0;
    padding: 7px;
    overflow: hidden;
    background: #eaeded;
    min-height: 100vh;
  }

  .listing-info-mobile .listing-info-container > .listing-item {
    background: #ffffff;
    margin-bottom: 7px !important;
  }

  .listing-info-mobile .listing-info-container > .listing-item .prize-image {
    max-width: 200px;
    min-height: 220px;
  }

  .listing-info-mobile .listing-info-container > .listing-item .prize-image > img {
    max-width: 200px;
    max-height: 220px;
  }

  .listing-info-mobile .listing-not-found-container {
    margin: 0;
    padding: 7px;
    overflow: hidden;
    background: #eaeded;
  }

  .listing-info-mobile .listing-loading-container {
    margin: 0;
    padding: 7px;
    overflow: hidden;
    background: #eaeded;
  }

  .listing-info-mobile .listing-error-container {
    margin: 0;
    padding: 7px;
    overflow: hidden;
    background: #eaeded;
  }

  .listing-item {
    cursor: pointer;
    overflow: hidden;
    color: #111111;
  }

  .listing-item .prize-image {
    margin: auto;
  }

  .listing-item .item-link {
    color: inherit !important;
    display: block;
    padding: 14px;
  }

  .listing-item .item-link:hover {
    text-decoration: none;
  }

  .standard-card {
    display: block;
  }

  .winner-promo-card {
    display: block;
    text-align: center;
    height: 100%;
  }

  .winner-promo-card .overlay {
    top: 0;
    left: 0;
    margin: 0;
    z-index: 1;
    height: 100%;
    width: 100%;
    position: absolute;
    background-size: cover;
    background-repeat: no-repeat;
    background-position: center center;
  }

  .winner-promo-card .item-link {
    height: 100%;
    position: relative;
  }

  .winner-promo-card .top {
    z-index: 2;
  }

  .giveaway-of-the-day-card {
    display: block;
    text-align: center;
    height: 100%;
  }

  .giveaway-of-the-day-card .overlay {
    margin: 0;
    z-index: 1;
    width: 100%;
    position: absolute;
    background-repeat: no-repeat;
    background-position: left bottom;
    background-size: contain;
  }

  .giveaway-of-the-day-card .item-link {
    height: 100%;
    position: relative;
  }

  .giveaway-of-the-day-card .top {
    z-index: 2;
  }

  .giveaway-of-the-day-card.mobile .overlay {
    top: 0;
    left: -13px;
    height: 100%;
  }

  .giveaway-of-the-day-card.mobile .prize-image {
    position: relative;
    width: 100%;
    min-width: 100%;
  }

  .giveaway-of-the-day-card.desktop .overlay {
    bottom: 0;
    left: 0;
    height: 70%;
  }

  .giveaway-of-the-day-card.desktop .ga-grid,
  .giveaway-of-the-day-card.desktop .prize-info {
    height: 100%;
  }

  .giveaway-of-the-day-card.desktop .prize-title {
    min-height: 20px;
  }

  .giveaway-of-the-day-card.desktop .prize-image {
    padding: 10px 0;
    height: 100%;
  }

  .giveaway-of-the-day-card.desktop .prize-image,
  .giveaway-of-the-day-card.desktop .prize-image > img {
    width: 285px;
    height: 225px;
    max-width: 285px !important;
    max-height: 225px !important;
  }

  .spinner.aui {
    margin: auto;
    text-align: center;
  }

  .spinner.ga {
    opacity: 0.75;
    margin: 100px auto;
    width: 100px;
    height: 15px;
    text-align: center;
    font-size: 10px;
  }

  .spinner.ga > div {
    margin: 3px;
    height: 100%;
    width: 7px;
    display: inline-block;
    -webkit-animation: ga-spinner 1.2s infinite ease-in-out;
    animation: ga-spinner 1.2s infinite ease-in-out;
  }

  .spinner.ga .rect1 {
    background: #a1cd45;
  }

  .spinner.ga .rect2 {
    background: #febe18;
    -webkit-animation-delay: -1.1s;
    animation-delay: -1.1s;
  }

  .spinner.ga .rect3 {
    background: #ee368e;
    -webkit-animation-delay: -1s;
    animation-delay: -1s;
  }

  .spinner.ga .rect4 {
    background: #00addb;
    -webkit-animation-delay: -0.9s;
    animation-delay: -0.9s;
  }

  .spinner.ga .rect5 {
    background: #f99d27;
    -webkit-animation-delay: -0.8s;
    animation-delay: -0.8s;
  }

  @-webkit-keyframes ga-spinner {
    0%,
    40%,
    100% {
      transform: scaleY(0.4);
      -webkit-transform: scaleY(0.4);
    }

    20% {
      transform: scaleY(1);
      -webkit-transform: scaleY(1);
    }
  }

  @keyframes ga-spinner {
    0%,
    40%,
    100% {
      transform: scaleY(0.4);
      -webkit-transform: scaleY(0.4);
    }

    20% {
      transform: scaleY(1);
      -webkit-transform: scaleY(1);
    }
  }

  .listing-info-mobile .giveaway-result-info-bar {
    background-color: #eaeded;
  }

  .listing-info-mobile .giveaways-number-message {
    height: 35px;
    padding-left: 7px;
  }

  .listing-info-desktop .listing-loading-container {
    margin: 0;
    background: #eaeded;
    border: 1px solid #e7e7e7;
    padding: 18px 18px 5px;
    min-height: 100vh;
    overflow: hidden;
  }

  .listing-info-desktop .listing-loading-container .spinner {
    margin-top: 100px;
  }

  .listing-info-desktop .listing-not-found-container {
    margin: 0;
    background: #eaeded;
    border: 1px solid #e7e7e7;
    padding: 18px 18px 5px;
  }

  .listing-info-desktop .listing-error-container {
    margin: 0;
    background: #eaeded;
    border: 1px solid #e7e7e7;
    padding: 18px 18px 5px;
  }

  .listing-info-desktop .listing-info-container {
    margin: 0;
    background: #eaeded;
    border: 1px solid #e7e7e7;
    padding: 18px 18px 5px;
    display: -webkit-box;
    display: -ms-flexbox;
    display: flex;
    -ms-flex-wrap: wrap;
    flex-wrap: wrap;
    margin-left: -14px;
  }

  .listing-info-desktop .listing-info-container > .listing-item .prize-image {
    max-width: 160px;
    min-height: 160px;
  }

  .listing-info-desktop .listing-info-container > .listing-item .prize-image > img {
    max-width: 160px;
    max-height: 160px;
  }


  @media only screen and (min-width: 400px) {
    .listing-info-desktop .listing-info-container > .listing-item {
      background: #ffffff;
      margin-left: 14px;
      -ms-flex-preferred-size: calc(33.3% - 14px);
      flex-basis: calc(33.3% - 14px);
      max-width: calc(33.3% - 14px);
    }

    .listing-info-desktop .listing-info-container > .listing-item.x2 {
      -ms-flex-preferred-size: calc(66.6% - 14px);
      flex-basis: calc(66.6% - 14px);
      max-width: calc(66.6% - 14px);
    }
  }

  

    .listing-info-desktop .listing-info-container > .listing-item.x2 {
      -ms-flex-preferred-size: calc(50% - 14px);
      flex-basis: calc(50% - 14px);
      max-width: calc(50% - 14px);
    }
  }

  @media only screen and (min-width: 1920px) {
    .listing-info-desktop .listing-info-container > .listing-item {
      background: #ffffff;
      margin-left: 14px;
      -ms-flex-preferred-size: calc(16.6% - 14px);
      flex-basis: calc(16.6% - 14px);
      max-width: calc(16.6% - 14px);
    }

    .listing-info-desktop .listing-info-container > .listing-item.x2 {
      -ms-flex-preferred-size: calc(33.2% - 14px);
      flex-basis: calc(33.2% - 14px);
      max-width: calc(33.2% - 14px);
    }
  }

  @media only screen and (min-width: 2500px) {
    .listing-info-desktop .listing-info-container > .listing-item {
      background: #ffffff;
      margin-left: 14px;
      -ms-flex-preferred-size: calc(12.5% - 14px);
      flex-basis: calc(12.5% - 14px);
      max-width: calc(12.5% - 14px);
    }

    .listing-info-desktop .listing-info-container > .listing-item.x2 {
      -ms-flex-preferred-size: calc(25% - 14px);
      flex-basis: calc(25% - 14px);
      max-width: calc(25% - 14px);
    }
  }

  .listing-info-desktop .giveaway-result-info-bar {
    padding: 0 18px;
  }

  .listing-info-desktop .giveaway-result-info-bar .ga-subscribe-link {
    color: #008296 !important;
    text-transform: uppercase;
  }

  .listing-info-desktop .ga-pagination-section {
    position: relative;
  }

  @media only screen and (max-width: 999px) {
    .listing-info-desktop .ga-pagination-section .ga-faq {
      display: block;
      text-align: right;
      margin-right: 18px;
    }
  }

  @media only screen and (min-width: 1000px) {
    .listing-info-desktop .ga-pagination-section .ga-faq {
      top: 10px;
      right: 18px;
      position: absolute;
    }
  }

  .listing-info-desktop .ga-pagination-section .ga-faq .ga-faq-link {
    color: #008296 !important;
    text-transform: uppercase;
  }

  .ga-pagination {
    position: relative;
    background: #ffffff;
    text-align: center;
  }

  .banner-container {
    background: #ffffff;
    border-bottom: 1px solid #e7e7e7;
  }

  .banner-container .banner-background-image {
    background: no-repeat 50% 50%;
    background-size: cover;
  }

  @media screen and (max-width: 699px) {
    .banner-container .banner-background-image {
      height: 90px;
    }
  }

  @media screen and (min-width: 700px) and (max-width: 899px) {
    .banner-container .banner-background-image {
      height: 95px;
    }
  }

  @media screen and (min-width: 900px) and (max-width: 1199px) {
    .banner-container .banner-background-image {
      height: 100px;
    }
  }


  @media screen and (min-width: 1500px) and (max-width: 1799px) {
    .banner-container .banner-background-image {
      height: 110px;
    }
  }

  @media screen and (min-width: 1800px) {
    .banner-container .banner-background-image {
      height: 115px;
    }
  }

  @media screen and (min-width: 2000px) {
    .banner-container .banner-background-image {
      height: 5vw;
    }
  }

  .participation-page {
    font-family: Amazon Ember, Arial, sans-serif;
  }

  .participation-page .participation-desktop {
    min-width: 1000px;
  }

  .participation-info .participation-loading-container {
    margin: 0;
    background: #eaeded;
    border: 1px solid #e7e7e7;
    padding: 18px 18px 5px;
    min-height: 100vh;
    overflow: hidden;
  }

  .participation-info .participation-loading-container .spinner {
    margin-top: 100px;
  }

  .participation-info .participation-not-found-container {
    margin: 0;
    background: #eaeded;
    border: 1px solid #e7e7e7;
    padding: 18px 18px 5px;
  }

  .participation-info .participation-error-container {
    margin: 0;
    background: #eaeded;
    border: 1px solid #e7e7e7;
    padding: 18px 18px 5px;
  }

  .participation-info .participation-info-container {
    margin: 0;
    background: #ffffff;
    border: 1px solid #ffffff;
  }

  .a-button.full-width {
    width: 100%;
  }

  .giveaway-info-mobile .content {
    min-height: 370px;
    padding: 10px;
  }

  .giveaway-info-mobile .prize-name .ellipse-2-line {
    min-height: initial;
  }

  .giveaway-info-mobile .prize-image {
    position: relative;
  }

  .giveaway-info-mobile .prize-image img {
    max-width: 290px;
    max-height: 223px;
    min-height: 100px;
  }

  .giveaway-info-mobile .gotd-overlay {
    top: 0;
    left: 0;
    bottom: 0;
    margin: 0;
    z-index: 1;
    height: 100%;
    width: 100%;
    position: absolute;
    background-repeat: no-repeat;
    background-position: left bottom;
    background-size: contain;
  }

  .giveaway-info-mobile .lucky-number-container {
    min-height: 300px;
  }

  .giveaway-info-mobile .participation-need-login .sign-in,
  .giveaway-info-mobile .participation-issue-login .sign-in {
    width: 100%;
    margin: 20px 0;
  }

  .giveaway-info-mobile .participation-issue-phone .verify-phone {
    width: 100%;
    margin: 20px 0;
  }

  .giveaway-info-mobile .footer {
    overflow: hidden;
    background: #eeeeee;
    margin-bottom: 30px;
    padding: 0 10px;
  }

  .giveaway-info-mobile .footer .terms {
    white-space: pre-line;
    margin: auto;
  }

  .giveaway-info-mobile .footer .links {
    margin: auto;
  }

  .giveaway-info-mobile .footer .links a {
    float: left;
    text-align: center;
    width: 25%;
    padding: 10px 10px 30px;
  }

  .giveaway-info-mobile .not-active {
    background: #f1d583;
  }

  .strikethrough-price {
    text-decoration: line-through;
  }

  .participation-action .participation-action-container {
    position: relative;
  }

  .participation-action .enter-container .enter-button {
    width: 100%;
    margin: 35px 0;
  }

  .participation-action .animation-container {
    position: absolute;
    pointer-events: none;
    width: 100%;
    height: 980px;
    top: -700px;
  }

  .participation-action .animation-container .ga-box {
    width: 360px;
    height: 980px;
    margin-left: auto;
    margin-right: auto;
  }

  .participation-action .animation-container .box-click-area {
    display: block;
    pointer-events: all;
    position: relative;
    cursor: pointer;
    color: initial;
    text-decoration: none;
    top: -200px;
    height: 200px;
    width: 100%;
    padding-top: 190px;
  }

  .participation-action .youtube-container {
    margin: 25px 0;
  }

  .participation-action .youtube-container .youtube-video {
    width: 100%;
    height: 250px;
  }

  .participation-action .youtube-container .youtube-video .video {
    width: 100%;
    height: 100%;
    border: 0;
    outline: 0;
  }

  .participation-action .youtube-container .youtube-continue-button {
    width: 100%;
    margin-top: 15px;
  }

  .participation-action .amazon-video-container {
    margin: 25px 0;
  }

  .participation-action .amazon-video-container .amazon-video {
    width: 100%;
    height: 250px;
  }

  .participation-action .amazon-video-container .amazon-video .video {
    width: 100%;
    height: 100%;
    border: 0;
    outline: 0;
  }

  .participation-action .amazon-video-container .amazon-video-continue-button {
    width: 100%;
    margin-top: 15px;
  }

  .participation-action .follow-author-container {
    margin: 25px 0;
  }

  .participation-action .follow-author-container .follow-author-continue-button {
    width: 100%;
    margin-top: 15px;
  }

  .ga-box {
    pointer-events: none;
  }

  #Stage_win_chicklet,
  #Stage_win_prize_placeholder {
    display: none !important;
  }

  .participation-post-entry-container {
    position: relative;
  }

  .participation-post-entry-container .see-all-container .see-all-button {
    margin: 35px 0;
    width: 100%;
  }

  .participation-post-entry-container .prime-day-container {
    margin-top: 10px;
  }

  .add-to-cart-container {
    min-height: 47px;
  }

  .add-to-cart-container .add-to-cart-button {
    width: 100%;
    margin: 18px 0;
  }

  .add-to-cart-container .add-to-cart-loading-container {
    padding: 18px 0 12px;
  }

  .winner-flow .winner-flow-continue-button {
    width: 75%;
    margin: 20px 0;
  }

  .mobile .winner-flow .winner-flow-continue-button {
    width: 100%;
  }

  .a-button.full-width {
    width: 100%;
  }

  .giveaway-info-desktop .content {
    min-height: 475px;
    padding: 36px 18px 5px;
  }

  .giveaway-info-desktop .column-left {
    width: 50%;
    display: inline-block;
    float: left;
  }

  .giveaway-info-desktop .column-left .container {
    float: right;
    width: 340px;
    padding-right: 10px;
  }

  .giveaway-info-desktop .column-right {
    width: 50%;
    display: inline-block;
    float: left;
  }

  .giveaway-info-desktop .column-right .container {
    float: left;
    width: 430px;
    padding: 0 10px;
  }

  .giveaway-info-desktop .prize-name .ellipse-2-line {
    min-height: initial;
  }

  .giveaway-info-desktop .prize-image {
    position: relative;
  }

  .giveaway-info-desktop .prize-image img {
    max-width: 290px;
    max-height: 223px;
    min-height: 100px;
  }

  .giveaway-info-desktop .gotd-overlay {
    top: 0;
    left: 0;
    bottom: 0;
    margin: 0;
    z-index: 1;
    height: 100%;
    width: 100%;
    position: absolute;
    background-repeat: no-repeat;
    background-position: left bottom;
    background-size: contain;
  }

  .giveaway-info-desktop .participation-need-action {
    min-height: 300px;
  }

  .giveaway-info-desktop .participation-need-login .sign-in,
  .giveaway-info-desktop .participation-issue-login .sign-in {
    width: 100%;
    margin: 20px 0;
  }

  .giveaway-info-desktop .participation-issue-phone .verify-phone {
    width: 100%;
    margin: 20px 0;
  }

  .giveaway-info-desktop .clear {
    clear: both;
  }

  .giveaway-info-desktop .footer {
    overflow: hidden;
    background: #eeeeee;
    margin-bottom: 30px;
  }

  .giveaway-info-desktop .footer .terms {
    width: 540px;
    white-space: pre-line;
    margin: auto;
  }

  .giveaway-info-desktop .footer .links {
    width: 540px;
    margin: auto;
  }

  .giveaway-info-desktop .footer .links a {
    float: left;
    text-align: center;
    width: 25%;
    padding: 10px 10px 30px;
  }

  .giveaway-info-desktop .footer .links .limit {
    padding: 10px 30px 30px;
  }

  .giveaway-info-desktop .not-active {
    background: #f1d583;
  }

  .s-suggestion {
    padding: 8px 10px;
    font-size: 16px;
    font-family: 'Amazon Ember';
    cursor: pointer;
  }
  </style>
`
