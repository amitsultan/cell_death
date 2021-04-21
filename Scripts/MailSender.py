import smtplib
import sys    

def sendMail(username, password, mailAddress, subject, content):

    toaddrs  = mailAddress
    msg = "\r\n".join([
    "From: " + username,
    "To: " + mailAddress,
    "Subject: " + subject,
    "",
    content
    ])

    server = smtplib.SMTP('smtp.gmail.com:587')
    server.ehlo()
    server.starttls()

    server.login(username,password)
    server.sendmail(username, toaddrs, msg)
    server.quit()


sendMail(sys.argv[1], sys.argv[2], sys.argv[3], sys.argv[4], sys.argv[5])