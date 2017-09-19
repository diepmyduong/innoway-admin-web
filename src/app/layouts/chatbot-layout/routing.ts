import { ChatbotLayoutComponent } from './chatbot-layout.component'

export const ChatbotLayoutRouting = {
    path: 'chatbot',
    component: ChatbotLayoutComponent,
    data: {
    title: 'Chat bot'
    },
    children: [
        {
            path: '',
            loadChildren: 'app/apps/chatbot/chatbot.module#ChatbotModule'
        },
    ]
}