import { ContactProvider } from './ContactContext';
import { ContactGrid } from './ContactGrid';
import { ContactMenu } from './ContactMenu';
import { ContactForm } from './ContactForm';

export default function ContactBook() {
    return (
        <ContactProvider>
            <h1>CONTACT BOOK</h1>
            <ContactMenu />
            <ContactGrid />
            <ContactForm />
        </ContactProvider>
    );
}
