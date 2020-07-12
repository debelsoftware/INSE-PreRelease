const nodemailer = require("nodemailer");

// -- EMAILER ---
async function sendEmailNotif(address, username){
  // create reusable transporter object using the default SMTP transport
  let transporter = nodemailer.createTransport({
    host: "mail.teammaker.app",
    port: 465,
    secure: true,
    auth: {
      user: "notifications-noreply@teammaker.app",
      pass: "REDACTED"
    },
    tls: {
    // do not fail on invalid certs
      rejectUnauthorized: false
    }
  });

  // send mail with defined transport object
  let info = await transporter.sendMail({
    from: '"Team Maker" <notifications-noreply@teammaker.app>', // sender address
    to: address, // list of receivers
    subject: "Thanks for registering", // Subject line
    html: `
    <!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional //EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">

    <html xmlns="http://www.w3.org/1999/xhtml" xmlns:o="urn:schemas-microsoft-com:office:office" xmlns:v="urn:schemas-microsoft-com:vml">
    <head>
    <!--[if gte mso 9]><xml><o:OfficeDocumentSettings><o:AllowPNG/><o:PixelsPerInch>96</o:PixelsPerInch></o:OfficeDocumentSettings></xml><![endif]-->
    <meta content="text/html; charset=utf-8" http-equiv="Content-Type"/>
    <meta content="width=device-width" name="viewport"/>
    <!--[if !mso]><!-->
    <meta content="IE=edge" http-equiv="X-UA-Compatible"/>
    <!--<![endif]-->
    <title></title>
    <!--[if !mso]><!-->
    <link href="https://fonts.googleapis.com/css?family=Montserrat" rel="stylesheet" type="text/css"/>
    <!--<![endif]-->
    <style type="text/css">
    		body {
    			margin: 0;
    			padding: 0;
    		}

    		table,
    		td,
    		tr {
    			vertical-align: top;
    			border-collapse: collapse;
    		}

    		* {
    			line-height: inherit;
    		}

    		a[x-apple-data-detectors=true] {
    			color: inherit !important;
    			text-decoration: none !important;
    		}

    		.ie-browser table {
    			table-layout: fixed;
    		}

    		[owa] .img-container div,
    		[owa] .img-container button {
    			display: block !important;
    		}

    		[owa] .fullwidth button {
    			width: 100% !important;
    		}

    		[owa] .block-grid .col {
    			display: table-cell;
    			float: none !important;
    			vertical-align: top;
    		}

    		.ie-browser .block-grid,
    		.ie-browser .num12,
    		[owa] .num12,
    		[owa] .block-grid {
    			width: 600px !important;
    		}

    		.ie-browser .mixed-two-up .num4,
    		[owa] .mixed-two-up .num4 {
    			width: 200px !important;
    		}

    		.ie-browser .mixed-two-up .num8,
    		[owa] .mixed-two-up .num8 {
    			width: 400px !important;
    		}

    		.ie-browser .block-grid.two-up .col,
    		[owa] .block-grid.two-up .col {
    			width: 300px !important;
    		}

    		.ie-browser .block-grid.three-up .col,
    		[owa] .block-grid.three-up .col {
    			width: 300px !important;
    		}

    		.ie-browser .block-grid.four-up .col [owa] .block-grid.four-up .col {
    			width: 150px !important;
    		}

    		.ie-browser .block-grid.five-up .col [owa] .block-grid.five-up .col {
    			width: 120px !important;
    		}

    		.ie-browser .block-grid.six-up .col,
    		[owa] .block-grid.six-up .col {
    			width: 100px !important;
    		}

    		.ie-browser .block-grid.seven-up .col,
    		[owa] .block-grid.seven-up .col {
    			width: 85px !important;
    		}

    		.ie-browser .block-grid.eight-up .col,
    		[owa] .block-grid.eight-up .col {
    			width: 75px !important;
    		}

    		.ie-browser .block-grid.nine-up .col,
    		[owa] .block-grid.nine-up .col {
    			width: 66px !important;
    		}

    		.ie-browser .block-grid.ten-up .col,
    		[owa] .block-grid.ten-up .col {
    			width: 60px !important;
    		}

    		.ie-browser .block-grid.eleven-up .col,
    		[owa] .block-grid.eleven-up .col {
    			width: 54px !important;
    		}

    		.ie-browser .block-grid.twelve-up .col,
    		[owa] .block-grid.twelve-up .col {
    			width: 50px !important;
    		}
    	</style>
    <style id="media-query" type="text/css">
    		@media only screen and (min-width: 620px) {
    			.block-grid {
    				width: 600px !important;
    			}

    			.block-grid .col {
    				vertical-align: top;
    			}

    			.block-grid .col.num12 {
    				width: 600px !important;
    			}

    			.block-grid.mixed-two-up .col.num3 {
    				width: 150px !important;
    			}

    			.block-grid.mixed-two-up .col.num4 {
    				width: 200px !important;
    			}

    			.block-grid.mixed-two-up .col.num8 {
    				width: 400px !important;
    			}

    			.block-grid.mixed-two-up .col.num9 {
    				width: 450px !important;
    			}

    			.block-grid.two-up .col {
    				width: 300px !important;
    			}

    			.block-grid.three-up .col {
    				width: 200px !important;
    			}

    			.block-grid.four-up .col {
    				width: 150px !important;
    			}

    			.block-grid.five-up .col {
    				width: 120px !important;
    			}

    			.block-grid.six-up .col {
    				width: 100px !important;
    			}

    			.block-grid.seven-up .col {
    				width: 85px !important;
    			}

    			.block-grid.eight-up .col {
    				width: 75px !important;
    			}

    			.block-grid.nine-up .col {
    				width: 66px !important;
    			}

    			.block-grid.ten-up .col {
    				width: 60px !important;
    			}

    			.block-grid.eleven-up .col {
    				width: 54px !important;
    			}

    			.block-grid.twelve-up .col {
    				width: 50px !important;
    			}
    		}

    		@media (max-width: 620px) {

    			.block-grid,
    			.col {
    				min-width: 320px !important;
    				max-width: 100% !important;
    				display: block !important;
    			}

    			.block-grid {
    				width: 100% !important;
    			}

    			.col {
    				width: 100% !important;
    			}

    			.col>div {
    				margin: 0 auto;
    			}

    			img.fullwidth,
    			img.fullwidthOnMobile {
    				max-width: 100% !important;
    			}

    			.no-stack .col {
    				min-width: 0 !important;
    				display: table-cell !important;
    			}

    			.no-stack.two-up .col {
    				width: 50% !important;
    			}

    			.no-stack .col.num4 {
    				width: 33% !important;
    			}

    			.no-stack .col.num8 {
    				width: 66% !important;
    			}

    			.no-stack .col.num4 {
    				width: 33% !important;
    			}

    			.no-stack .col.num3 {
    				width: 25% !important;
    			}

    			.no-stack .col.num6 {
    				width: 50% !important;
    			}

    			.no-stack .col.num9 {
    				width: 75% !important;
    			}

    			.video-block {
    				max-width: none !important;
    			}

    			.mobile_hide {
    				min-height: 0px;
    				max-height: 0px;
    				max-width: 0px;
    				display: none;
    				overflow: hidden;
    				font-size: 0px;
    			}

    			.desktop_hide {
    				display: block !important;
    				max-height: none !important;
    			}
    		}
    	</style>
    </head>
    <body class="clean-body" style="margin: 0; padding: 0; -webkit-text-size-adjust: 100%; background-color: #F8FAFF;">
    <!--[if IE]><div class="ie-browser"><![endif]-->
    <table bgcolor="#F8FAFF" cellpadding="0" cellspacing="0" class="nl-container" role="presentation" style="table-layout: fixed; vertical-align: top; min-width: 320px; Margin: 0 auto; border-spacing: 0; border-collapse: collapse; mso-table-lspace: 0pt; mso-table-rspace: 0pt; background-color: #F8FAFF; width: 100%;" valign="top" width="100%">
    <tbody>
    <tr style="vertical-align: top;" valign="top">
    <td style="word-break: break-word; vertical-align: top; border-collapse: collapse;" valign="top">
    <!--[if (mso)|(IE)]><table width="100%" cellpadding="0" cellspacing="0" border="0"><tr><td align="center" style="background-color:#F8FAFF"><![endif]-->
    <div style="background-color:transparent;">
    <div class="block-grid" data-body-width-father="600px" rel="col-num-container-box-father" style="Margin: 0 auto; min-width: 320px; max-width: 600px; overflow-wrap: break-word; word-wrap: break-word; word-break: break-word; background-color: transparent;">
    <div style="border-collapse: collapse;display: table;width: 100%;background-color:transparent;">
    <!--[if (mso)|(IE)]><table width="100%" cellpadding="0" cellspacing="0" border="0" style="background-color:transparent;"><tr><td align="center"><table cellpadding="0" cellspacing="0" border="0" style="width:600px"><tr class="layout-full-width" style="background-color:transparent"><![endif]-->
    <!--[if (mso)|(IE)]><td align="center" width="600" style="background-color:transparent;width:600px; border-top: 0px solid transparent; border-left: 0px solid transparent; border-bottom: 0px solid transparent; border-right: 0px solid transparent;" valign="top"><table width="100%" cellpadding="0" cellspacing="0" border="0"><tr><td style="padding-right: 0px; padding-left: 0px; padding-top:5px; padding-bottom:0px;"><![endif]-->
    <div class="col num12" data-body-width-son="600" rel="col-num-container-box-son" style="min-width: 320px; max-width: 600px; display: table-cell; vertical-align: top;">
    <div style="width:100% !important;">
    <!--[if (!mso)&(!IE)]><!-->
    <div style="border-top:0px solid transparent; border-left:0px solid transparent; border-bottom:0px solid transparent; border-right:0px solid transparent; padding-top:5px; padding-bottom:0px; padding-right: 0px; padding-left: 0px;">
    <!--<![endif]-->
    <!--[if mso]><table width="100%" cellpadding="0" cellspacing="0" border="0"><tr><td style="padding-right: 10px; padding-left: 10px; padding-top: 10px; padding-bottom: 10px; font-family: 'Trebuchet MS', Tahoma, sans-serif"><![endif]-->
    <div style="color:#555555;font-family:'Montserrat', 'Trebuchet MS', 'Lucida Grande', 'Lucida Sans Unicode', 'Lucida Sans', Tahoma, sans-serif;line-height:120%;padding-top:10px;padding-right:10px;padding-bottom:10px;padding-left:10px;">
    <p style="font-size: 12px; line-height: 14px; color: #555555; font-family: 'Montserrat', 'Trebuchet MS', 'Lucida Grande', 'Lucida Sans Unicode', 'Lucida Sans', Tahoma, sans-serif; margin: 0;"><br/></p>
    </div>
    <!--[if mso]></td></tr></table><![endif]-->
    <!--[if (!mso)&(!IE)]><!-->
    </div>
    <!--<![endif]-->
    </div>
    </div>
    <!--[if (mso)|(IE)]></td></tr></table><![endif]-->
    <!--[if (mso)|(IE)]></td></tr></table></td></tr></table><![endif]-->
    </div>
    </div>
    </div>
    <div style="background-color:transparent;">
    <div class="block-grid" data-body-width-father="600px" rel="col-num-container-box-father" style="Margin: 0 auto; min-width: 320px; max-width: 600px; overflow-wrap: break-word; word-wrap: break-word; word-break: break-word; background-color: #FFFFFF;">
    <div style="border-collapse: collapse;display: table;width: 100%;background-color:#FFFFFF;">
    <!--[if (mso)|(IE)]><table width="100%" cellpadding="0" cellspacing="0" border="0" style="background-color:transparent;"><tr><td align="center"><table cellpadding="0" cellspacing="0" border="0" style="width:600px"><tr class="layout-full-width" style="background-color:#FFFFFF"><![endif]-->
    <!--[if (mso)|(IE)]><td align="center" width="600" style="background-color:#FFFFFF;width:600px; border-top: 0px solid transparent; border-left: 0px solid transparent; border-bottom: 0px solid transparent; border-right: 0px solid transparent;" valign="top"><table width="100%" cellpadding="0" cellspacing="0" border="0"><tr><td style="padding-right: 0px; padding-left: 0px; padding-top:5px; padding-bottom:5px;"><![endif]-->
    <div class="col num12" data-body-width-son="600" rel="col-num-container-box-son" style="min-width: 320px; max-width: 600px; display: table-cell; vertical-align: top;">
    <div style="width:100% !important;">
    <!--[if (!mso)&(!IE)]><!-->
    <div style="border-top:0px solid transparent; border-left:0px solid transparent; border-bottom:0px solid transparent; border-right:0px solid transparent; padding-top:5px; padding-bottom:5px; padding-right: 0px; padding-left: 0px;">
    <!--<![endif]-->
    <div align="center" class="img-container center fixedwidth" style="padding-right: 0px;padding-left: 0px;">
    <!--[if mso]><table width="100%" cellpadding="0" cellspacing="0" border="0"><tr style="line-height:0px"><td style="padding-right: 0px;padding-left: 0px;" align="center"><![endif]--><img align="center" alt="Image" border="0" class="center fixedwidth" src="https://teammaker.app/img/emaillogo.png" style="outline: none; text-decoration: none; -ms-interpolation-mode: bicubic; clear: both; border: 0; height: auto; float: none; width: 100%; max-width: 210px; display: block;" title="Image" width="210"/>
    <!--[if mso]></td></tr></table><![endif]-->
    </div>
    <!--[if (!mso)&(!IE)]><!-->
    </div>
    <!--<![endif]-->
    </div>
    </div>
    <!--[if (mso)|(IE)]></td></tr></table><![endif]-->
    <!--[if (mso)|(IE)]></td></tr></table></td></tr></table><![endif]-->
    </div>
    </div>
    </div>
    <div style="background-color:transparent;">
    <div class="block-grid" data-body-width-father="600px" rel="col-num-container-box-father" style="Margin: 0 auto; min-width: 320px; max-width: 600px; overflow-wrap: break-word; word-wrap: break-word; word-break: break-word; background-color: #FFFFFF;">
    <div style="border-collapse: collapse;display: table;width: 100%;background-color:#FFFFFF;">
    <!--[if (mso)|(IE)]><table width="100%" cellpadding="0" cellspacing="0" border="0" style="background-color:transparent;"><tr><td align="center"><table cellpadding="0" cellspacing="0" border="0" style="width:600px"><tr class="layout-full-width" style="background-color:#FFFFFF"><![endif]-->
    <!--[if (mso)|(IE)]><td align="center" width="600" style="background-color:#FFFFFF;width:600px; border-top: 0px solid transparent; border-left: 0px solid transparent; border-bottom: 0px solid transparent; border-right: 0px solid transparent;" valign="top"><table width="100%" cellpadding="0" cellspacing="0" border="0"><tr><td style="padding-right: 0px; padding-left: 0px; padding-top:0px; padding-bottom:5px;"><![endif]-->
    <div class="col num12" data-body-width-son="600" rel="col-num-container-box-son" style="min-width: 320px; max-width: 600px; display: table-cell; vertical-align: top;">
    <div style="width:100% !important;">
    <!--[if (!mso)&(!IE)]><!-->
    <div style="border-top:0px solid transparent; border-left:0px solid transparent; border-bottom:0px solid transparent; border-right:0px solid transparent; padding-top:0px; padding-bottom:5px; padding-right: 0px; padding-left: 0px;">
    <!--<![endif]-->
    <!--[if mso]><table width="100%" cellpadding="0" cellspacing="0" border="0"><tr><td style="padding-right: 10px; padding-left: 10px; padding-top: 10px; padding-bottom: 10px; font-family: 'Trebuchet MS', Tahoma, sans-serif"><![endif]-->
    <div style="color:#0D0D0D;font-family:'Montserrat', 'Trebuchet MS', 'Lucida Grande', 'Lucida Sans Unicode', 'Lucida Sans', Tahoma, sans-serif;line-height:120%;padding-top:10px;padding-right:10px;padding-bottom:10px;padding-left:10px;">
    <div style="font-size: 12px; line-height: 14px; font-family: 'Montserrat', 'Trebuchet MS', 'Lucida Grande', 'Lucida Sans Unicode', 'Lucida Sans', Tahoma, sans-serif; color: #0D0D0D;">
    <p style="font-size: 14px; line-height: 33px; text-align: center; margin: 0;"><span style="font-size: 28px;">You're ready to go</span></p>
    </div>
    </div>
    <!--[if mso]></td></tr></table><![endif]-->
    <!--[if mso]><table width="100%" cellpadding="0" cellspacing="0" border="0"><tr><td style="padding-right: 10px; padding-left: 10px; padding-top: 10px; padding-bottom: 10px; font-family: 'Trebuchet MS', Tahoma, sans-serif"><![endif]-->
    <div style="color:#555555;font-family:'Montserrat', 'Trebuchet MS', 'Lucida Grande', 'Lucida Sans Unicode', 'Lucida Sans', Tahoma, sans-serif;line-height:150%;padding-top:10px;padding-right:10px;padding-bottom:10px;padding-left:10px;">
    <div style="font-size: 12px; line-height: 18px; font-family: 'Montserrat', 'Trebuchet MS', 'Lucida Grande', 'Lucida Sans Unicode', 'Lucida Sans', Tahoma, sans-serif; color: #555555;">
    <p style="font-size: 14px; line-height: 21px; text-align: center; margin: 0;">Hey ${username}, just wanted to thank you for registering to Team Maker and to let you know your account is now fully up and running. We wish you the best of luck with your group projects.<span style="color: #a8bf6f; font-size: 14px; line-height: 21px;"><strong><br/></strong></span></p>
    </div>
    </div>
    <!--[if mso]></td></tr></table><![endif]-->
    <!--[if mso]><table width="100%" cellpadding="0" cellspacing="0" border="0"><tr><td style="padding-right: 10px; padding-left: 10px; padding-top: 20px; padding-bottom: 10px; font-family: 'Trebuchet MS', Tahoma, sans-serif"><![endif]-->
    <div style="color:#0D0D0D;font-family:'Montserrat', 'Trebuchet MS', 'Lucida Grande', 'Lucida Sans Unicode', 'Lucida Sans', Tahoma, sans-serif;line-height:150%;padding-top:20px;padding-right:10px;padding-bottom:10px;padding-left:10px;">
    <div style="font-size: 12px; line-height: 18px; font-family: 'Montserrat', 'Trebuchet MS', 'Lucida Grande', 'Lucida Sans Unicode', 'Lucida Sans', Tahoma, sans-serif; color: #0D0D0D;">
    <p style="font-size: 14px; line-height: 21px; text-align: center; margin: 0;">You can now start creating and joining teams. To begin click below</p>
    </div>
    </div>
    <!--[if mso]></td></tr></table><![endif]-->
    <div align="center" class="button-container" style="padding-top:25px;padding-right:10px;padding-bottom:10px;padding-left:10px;">
    <!--[if mso]><table width="100%" cellpadding="0" cellspacing="0" border="0" style="border-spacing: 0; border-collapse: collapse; mso-table-lspace:0pt; mso-table-rspace:0pt;"><tr><td style="padding-top: 25px; padding-right: 10px; padding-bottom: 10px; padding-left: 10px" align="center"><v:roundrect xmlns:v="urn:schemas-microsoft-com:vml" xmlns:w="urn:schemas-microsoft-com:office:word" href="https://teammaker.app/beta/login" style="height:46.5pt; width:90pt; v-text-anchor:middle;" arcsize="7%" stroke="false" fillcolor="#2eb0ff"><w:anchorlock/><v:textbox inset="0,0,0,0"><center style="color:#ffffff; font-family:'Trebuchet MS', Tahoma, sans-serif; font-size:16px"><![endif]--><a href="https://teammaker.app/beta/login" style="-webkit-text-size-adjust: none; text-decoration: none; display: inline-block; color: #ffffff; background-color: #2eb0ff; border-radius: 4px; -webkit-border-radius: 4px; -moz-border-radius: 4px; width: auto; width: auto; border-top: 1px solid #2eb0ff; border-right: 1px solid #2eb0ff; border-bottom: 1px solid #2eb0ff; border-left: 1px solid #2eb0ff; padding-top: 15px; padding-bottom: 15px; font-family: 'Montserrat', 'Trebuchet MS', 'Lucida Grande', 'Lucida Sans Unicode', 'Lucida Sans', Tahoma, sans-serif; text-align: center; mso-border-alt: none; word-break: keep-all;" target="_blank"><span style="padding-left:15px;padding-right:15px;font-size:16px;display:inline-block;">
    <span style="font-size: 16px; line-height: 32px;">Get Started</span>
    </span></a>
    <!--[if mso]></center></v:textbox></v:roundrect></td></tr></table><![endif]-->
    </div>
    <!--[if (!mso)&(!IE)]><!-->
    </div>
    <!--<![endif]-->
    </div>
    </div>
    <!--[if (mso)|(IE)]></td></tr></table><![endif]-->
    <!--[if (mso)|(IE)]></td></tr></table></td></tr></table><![endif]-->
    </div>
    </div>
    </div>
    <div style="background-color:transparent;">
    <div class="block-grid" data-body-width-father="600px" rel="col-num-container-box-father" style="Margin: 0 auto; min-width: 320px; max-width: 600px; overflow-wrap: break-word; word-wrap: break-word; word-break: break-word; background-color: #FFFFFF;">
    <div style="border-collapse: collapse;display: table;width: 100%;background-color:#FFFFFF;">
    <!--[if (mso)|(IE)]><table width="100%" cellpadding="0" cellspacing="0" border="0" style="background-color:transparent;"><tr><td align="center"><table cellpadding="0" cellspacing="0" border="0" style="width:600px"><tr class="layout-full-width" style="background-color:#FFFFFF"><![endif]-->
    <!--[if (mso)|(IE)]><td align="center" width="600" style="background-color:#FFFFFF;width:600px; border-top: 0px solid transparent; border-left: 0px solid transparent; border-bottom: 0px solid transparent; border-right: 0px solid transparent;" valign="top"><table width="100%" cellpadding="0" cellspacing="0" border="0"><tr><td style="padding-right: 0px; padding-left: 0px; padding-top:5px; padding-bottom:5px;"><![endif]-->
    <div class="col num12" data-body-width-son="600" rel="col-num-container-box-son" style="min-width: 320px; max-width: 600px; display: table-cell; vertical-align: top;">
    <div style="width:100% !important;">
    <!--[if (!mso)&(!IE)]><!-->
    <div style="border-top:0px solid transparent; border-left:0px solid transparent; border-bottom:0px solid transparent; border-right:0px solid transparent; padding-top:5px; padding-bottom:5px; padding-right: 0px; padding-left: 0px;">
    <!--<![endif]-->
    <!--[if mso]><table width="100%" cellpadding="0" cellspacing="0" border="0"><tr><td style="padding-right: 10px; padding-left: 10px; padding-top: 10px; padding-bottom: 10px; font-family: 'Trebuchet MS', Tahoma, sans-serif"><![endif]-->
    <div style="color:#555555;font-family:'Montserrat', 'Trebuchet MS', 'Lucida Grande', 'Lucida Sans Unicode', 'Lucida Sans', Tahoma, sans-serif;line-height:120%;padding-top:10px;padding-right:10px;padding-bottom:10px;padding-left:10px;">
    <div style="font-family: 'Montserrat', 'Trebuchet MS', 'Lucida Grande', 'Lucida Sans Unicode', 'Lucida Sans', Tahoma, sans-serif; font-size: 12px; line-height: 14px; color: #555555;">
    <p style="font-size: 14px; line-height: 14px; text-align: center; margin: 0;"><span style="font-size: 12px;">Fun tip: If you type 'giphy' followed by a search term into the group chat, a random GIF will be sent based on the search term. For example, typing 'giphy cat' will send a random cat GIF</span></p>
    </div>
    </div>
    <!--[if mso]></td></tr></table><![endif]-->
    <!--[if (!mso)&(!IE)]><!-->
    </div>
    <!--<![endif]-->
    </div>
    </div>
    <!--[if (mso)|(IE)]></td></tr></table><![endif]-->
    <!--[if (mso)|(IE)]></td></tr></table></td></tr></table><![endif]-->
    </div>
    </div>
    </div>
    <div style="background-color:transparent;">
    <div class="block-grid" data-body-width-father="600px" rel="col-num-container-box-father" style="Margin: 0 auto; min-width: 320px; max-width: 600px; overflow-wrap: break-word; word-wrap: break-word; word-break: break-word; background-color: #2f4054;">
    <div style="border-collapse: collapse;display: table;width: 100%;background-color:#2f4054;">
    <!--[if (mso)|(IE)]><table width="100%" cellpadding="0" cellspacing="0" border="0" style="background-color:transparent;"><tr><td align="center"><table cellpadding="0" cellspacing="0" border="0" style="width:600px"><tr class="layout-full-width" style="background-color:#2f4054"><![endif]-->
    <!--[if (mso)|(IE)]><td align="center" width="600" style="background-color:#2f4054;width:600px; border-top: 0px solid transparent; border-left: 0px solid transparent; border-bottom: 0px solid transparent; border-right: 0px solid transparent;" valign="top"><table width="100%" cellpadding="0" cellspacing="0" border="0"><tr><td style="padding-right: 0px; padding-left: 0px; padding-top:5px; padding-bottom:5px;"><![endif]-->
    <div class="col num12" data-body-width-son="600" rel="col-num-container-box-son" style="min-width: 320px; max-width: 600px; display: table-cell; vertical-align: top;">
    <div style="width:100% !important;">
    <!--[if (!mso)&(!IE)]><!-->
    <div style="border-top:0px solid transparent; border-left:0px solid transparent; border-bottom:0px solid transparent; border-right:0px solid transparent; padding-top:5px; padding-bottom:5px; padding-right: 0px; padding-left: 0px;">
    <!--<![endif]-->
    <!--[if mso]><table width="100%" cellpadding="0" cellspacing="0" border="0"><tr><td style="padding-right: 10px; padding-left: 10px; padding-top: 10px; padding-bottom: 10px; font-family: 'Trebuchet MS', Tahoma, sans-serif"><![endif]-->
    <div style="color:#555555;font-family:'Montserrat', 'Trebuchet MS', 'Lucida Grande', 'Lucida Sans Unicode', 'Lucida Sans', Tahoma, sans-serif;line-height:120%;padding-top:10px;padding-right:10px;padding-bottom:10px;padding-left:10px;">
    <div style="font-family: 'Montserrat', 'Trebuchet MS', 'Lucida Grande', 'Lucida Sans Unicode', 'Lucida Sans', Tahoma, sans-serif; font-size: 12px; line-height: 14px; color: #555555;">
    <p style="font-size: 14px; line-height: 16px; text-align: center; margin: 0;"><span style="color: #ffffff; font-size: 14px; line-height: 16px;">Thank you for using Team Maker</span></p>
    </div>
    </div>
    <!--[if mso]></td></tr></table><![endif]-->
    <!--[if (!mso)&(!IE)]><!-->
    </div>
    <!--<![endif]-->
    </div>
    </div>
    <!--[if (mso)|(IE)]></td></tr></table><![endif]-->
    <!--[if (mso)|(IE)]></td></tr></table></td></tr></table><![endif]-->
    </div>
    </div>
    </div>
    <div style="background-color:transparent;">
    <div class="block-grid" data-body-width-father="600px" rel="col-num-container-box-father" style="Margin: 0 auto; min-width: 320px; max-width: 600px; overflow-wrap: break-word; word-wrap: break-word; word-break: break-word; background-color: transparent;">
    <div style="border-collapse: collapse;display: table;width: 100%;background-color:transparent;">
    <!--[if (mso)|(IE)]><table width="100%" cellpadding="0" cellspacing="0" border="0" style="background-color:transparent;"><tr><td align="center"><table cellpadding="0" cellspacing="0" border="0" style="width:600px"><tr class="layout-full-width" style="background-color:transparent"><![endif]-->
    <!--[if (mso)|(IE)]><td align="center" width="600" style="background-color:transparent;width:600px; border-top: 0px solid transparent; border-left: 0px solid transparent; border-bottom: 0px solid transparent; border-right: 0px solid transparent;" valign="top"><table width="100%" cellpadding="0" cellspacing="0" border="0"><tr><td style="padding-right: 0px; padding-left: 0px; padding-top:5px; padding-bottom:5px;"><![endif]-->
    <div class="col num12" data-body-width-son="600" rel="col-num-container-box-son" style="min-width: 320px; max-width: 600px; display: table-cell; vertical-align: top;">
    <div style="width:100% !important;">
    <!--[if (!mso)&(!IE)]><!-->
    <div style="border-top:0px solid transparent; border-left:0px solid transparent; border-bottom:0px solid transparent; border-right:0px solid transparent; padding-top:5px; padding-bottom:5px; padding-right: 0px; padding-left: 0px;">
    <!--<![endif]-->
    <!--[if mso]><table width="100%" cellpadding="0" cellspacing="0" border="0"><tr><td style="padding-right: 10px; padding-left: 10px; padding-top: 10px; padding-bottom: 10px; font-family: 'Trebuchet MS', Tahoma, sans-serif"><![endif]-->
    <div style="color:#555555;font-family:'Montserrat', 'Trebuchet MS', 'Lucida Grande', 'Lucida Sans Unicode', 'Lucida Sans', Tahoma, sans-serif;line-height:120%;padding-top:10px;padding-right:10px;padding-bottom:10px;padding-left:10px;">
    <div style="font-family: 'Montserrat', 'Trebuchet MS', 'Lucida Grande', 'Lucida Sans Unicode', 'Lucida Sans', Tahoma, sans-serif; font-size: 12px; line-height: 14px; color: #555555;">
    <p style="font-size: 12px; line-height: 12px; text-align: left; margin: 0;"><span style="font-size: 10px;">If you did not register to Team Maker, your Google account may be compromised as this is the only login option we offer.</span></p>
    <p style="font-size: 12px; line-height: 14px; text-align: left; margin: 0;"> </p>
    <p style="font-size: 12px; line-height: 12px; text-align: left; margin: 0;"><span style="font-size: 10px;">If you want to delete your account just login to your account and click 'delete my account' at the bottom of the 'team select' page</span></p>
    </div>
    </div>
    <!--[if mso]></td></tr></table><![endif]-->
    <!--[if (!mso)&(!IE)]><!-->
    </div>
    <!--<![endif]-->
    </div>
    </div>
    <!--[if (mso)|(IE)]></td></tr></table><![endif]-->
    <!--[if (mso)|(IE)]></td></tr></table></td></tr></table><![endif]-->
    </div>
    </div>
    </div>
    <!--[if (mso)|(IE)]></td></tr></table><![endif]-->
    </td>
    </tr>
    </tbody>
    </table>
    <!--[if (IE)]></div><![endif]-->
    </body>
    </html>` // html body
  });

  console.log("Message sent: %s", info.messageId);
}

module.exports.sendEmailNotif = sendEmailNotif;
