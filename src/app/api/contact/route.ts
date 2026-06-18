import { Resend } from "resend";
import { NextResponse } from "next/server";

export async function POST(request: Request) {
  const resend = new Resend(process.env.RESEND_API_KEY);
  const { name, email, message } = await request.json();

  if (!name || !email || !message) {
    return NextResponse.json({ error: "Missing fields" }, { status: 400 });
  }

  const { error } = await resend.emails.send({
    from: `Portfolio Contact <hello@${process.env.CONTACT_DOMAIN}>`,
    to: process.env.CONTACT_EMAIL!,
    replyTo: email,
    subject: `New message from ${name}`,
    text: `Name: ${name}\nEmail: ${email}\n\n${message}`,
    html: `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>New message from ${name}</title>
</head>
<body style="margin:0;padding:0;background:#010c15;font-family:'Fira Code',monospace,sans-serif;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background:#010c15;padding:40px 16px;">
    <tr>
      <td align="center">
        <table width="600" cellpadding="0" cellspacing="0" style="max-width:600px;width:100%;background:#011627;border:1px solid #1e2d3d;border-radius:8px;overflow:hidden;">

          <!-- Header -->
          <tr>
            <td style="padding:20px 28px;border-bottom:1px solid #1e2d3d;background:#011627;">
              <table width="100%" cellpadding="0" cellspacing="0">
                <tr>
                  <td style="color:#607b96;font-size:13px;">portfolio</td>
                  <td align="right" style="color:#607b96;font-size:13px;">_contact-me</td>
                </tr>
              </table>
            </td>
          </tr>

          <!-- Orange accent bar -->
          <tr>
            <td style="height:3px;background:#fea55f;"></td>
          </tr>

          <!-- Body -->
          <tr>
            <td style="padding:36px 28px;">

              <!-- Intro comment -->
              <p style="margin:0 0 24px;color:#607b96;font-size:13px;line-height:1.6;">
                // new message received via contact form
              </p>

              <!-- Code block -->
              <table width="100%" cellpadding="0" cellspacing="0" style="background:#010c15;border:1px solid #1e2d3d;border-radius:6px;overflow:hidden;">
                <tr>
                  <td style="padding:20px 24px;font-size:13px;line-height:2;">

                    <p style="margin:0;color:#e5e9f0;">
                      <span style="color:#4d5bce;">const</span>
                      <span style="color:#e5e9f0;"> </span>
                      <span style="color:#43d9ad;">message</span>
                      <span style="color:#e5e9f0;"> = {</span>
                    </p>

                    <p style="margin:0;padding-left:20px;color:#e5e9f0;">
                      <span style="color:#607b96;">name:</span>
                      <span style="color:#e5e9f0;"> </span>
                      <span style="color:#e99287;">"${name}"</span><span style="color:#e5e9f0;">,</span>
                    </p>

                    <p style="margin:0;padding-left:20px;color:#e5e9f0;">
                      <span style="color:#607b96;">email:</span>
                      <span style="color:#e5e9f0;"> </span>
                      <span style="color:#e99287;">"<a href="mailto:${email}" style="color:#e99287;text-decoration:underline;">${email}</a>"</span><span style="color:#e5e9f0;">,</span>
                    </p>

                    <p style="margin:0;padding-left:20px;color:#e5e9f0;">
                      <span style="color:#607b96;">message:</span>
                      <span style="color:#e5e9f0;"> </span>
                      <span style="color:#e99287;">&#96;${message.replace(/\n/g, "<br/>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;")}&#96;</span><span style="color:#e5e9f0;">,</span>
                    </p>

                    <p style="margin:0;padding-left:20px;color:#e5e9f0;">
                      <span style="color:#607b96;">date:</span>
                      <span style="color:#e5e9f0;"> </span>
                      <span style="color:#e99287;">"${new Date().toUTCString()}"</span>
                    </p>

                    <p style="margin:0;color:#e5e9f0;">}</p>

                  </td>
                </tr>
              </table>

              <!-- Reply CTA -->
              <table width="100%" cellpadding="0" cellspacing="0" style="margin-top:28px;">
                <tr>
                  <td>
                    <a href="mailto:${email}" style="display:inline-block;background:#fea55f;color:#01080e;text-decoration:none;font-size:13px;font-weight:500;padding:10px 18px;border-radius:6px;">
                      reply-to-${name.split(" ")[0].toLowerCase()}
                    </a>
                  </td>
                </tr>
              </table>

            </td>
          </tr>

          <!-- Footer -->
          <tr>
            <td style="padding:16px 28px;border-top:1px solid #1e2d3d;">
              <p style="margin:0;color:#607b96;font-size:12px;">// sent via your portfolio contact form</p>
            </td>
          </tr>

        </table>
      </td>
    </tr>
  </table>
</body>
</html>`,
  });

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ ok: true });
}
