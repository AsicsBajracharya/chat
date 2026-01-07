// import { resendClient, sender } from "../lib/resend"
import{resendClient, sender} from '../lib/resend.js'
import { createWelcomeEmailTemplate } from "./emailTemplate.js"

export const sendWelcomeEmail = async(email, name, clientURL) =>{
    const {data, error} = await resendClient.emails.send({
        from: `${sender.name} <${sender.email}>`, 
        to: email, 
        subject: 'welcome to chat', 
        html: createWelcomeEmailTemplate(name, clientURL)
    })

    if(error) {
        console.log('error sending email', error)
        throw new Error('failed to send email')
    }    
    console.log('welcome email sent successfully', data)
}