import { Injectable } from '@nestjs/common';
import { CreateIdentifyDto } from './dto/create-identify.dto';
import { DatabaseService } from 'src/database/database.service';
import { Console } from 'console';

@Injectable()
export class IdentifyService { 
  constructor(private readonly databaseService: DatabaseService) {}

  async create(createIdentifyDto: CreateIdentifyDto) {   
    let { email, phoneNumber } = createIdentifyDto;  
    email = email?.trim() || null;
    phoneNumber = phoneNumber?.trim() || null;  
    if (!email && !phoneNumber) {
      // If both email and phone number are not provided, return an appropriate response or handle as needed
      return {
        contact: null,
        message: 'At least one of email or phone number must be provided.'
      };
    }


    let existingContacts = await this.databaseService.contact.findMany({
      where: {
        OR: [
          { email: email },
          { phoneNumber: phoneNumber },
        ],
      }
    });
  console.log(existingContacts) 
// CASE 1: If no contacts found, create a new primary contact
    if (existingContacts.length === 0) {
      const newContact = await this.databaseService.contact.create({
        data: {
          email: email,
          phoneNumber: phoneNumber,
          linkedId: null,
          linkPrecedence: "Primary",
        },
      });

      return {
        contact: {
          primaryContactId: newContact.id,
          emails: [email],
          phoneNumbers: [phoneNumber],
          secondaryContactIds: [],
        },
      };
    }

    // Get all linked contacts
    let allContacts = [];
    for (const contact of existingContacts) {
      if (contact.linkedId) {
        const linkedContacts = await this.databaseService.contact.findMany({
          where: {
            OR: [
              { id: contact.linkedId },
              { linkedId: contact.linkedId },
            ],
          }
        });
        allContacts.push(...linkedContacts);
      } else {
        const linkedContacts = await this.databaseService.contact.findMany({
          where: {
            linkedId: contact.id,
          }
        });
        allContacts.push(contact, ...linkedContacts);
      }
    }

    // Remove duplicates
    allContacts = Array.from(new Set(allContacts.map(c => c.id))).map(id => allContacts.find(c => c.id === id));

    const sortedContacts = allContacts.sort((a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime());
    const primaryContact = sortedContacts[0];
    const secondaryContacts = sortedContacts.slice(1);

    // Check if we need to create a new secondary contact
    const emailExists = email ? allContacts.some(contact => contact.email === email) : true;
    const phoneNumberExists = phoneNumber ? allContacts.some(contact => contact.phoneNumber === phoneNumber) : true;

    


// CASE 2: If contact with both email and phnone number exists, we are not going to create a new record instead we would just update the existing records. 
    if (emailExists && phoneNumberExists) {
      // Update secondary contacts
      await this.databaseService.contact.updateMany({
        where: {
          id: {
            in: secondaryContacts.map(contact => contact.id),
          },
        },
        data: {
          linkedId: primaryContact.id,
          linkPrecedence: "Secondary"
        },
      });  

      //Update primary contacts    
      await this.databaseService.contact.update({
        where:{
          id:primaryContact.id,
        },
        data:{
          linkPrecedence:"Primary"
        }
      })

      // Gather all unique emails and phone numbers
           const uniqueEmails = new Set(sortedContacts.map(contact => contact.email).filter(email => email));
           const uniquePhoneNumbers = new Set(sortedContacts.map(contact => contact.phoneNumber).filter(phoneNumber => phoneNumber));
           if (email) uniqueEmails.add(email);
           if (phoneNumber) uniquePhoneNumbers.add(phoneNumber);

           return {
              contact: {
              primaryContactId: primaryContact.id,
              emails: Array.from(uniqueEmails),
              phoneNumbers: Array.from(uniquePhoneNumbers),
              secondaryContactIds: secondaryContacts.map(contact => contact.id),
            }
            };
    }
    
 
    



 //CASE 3: If either one but not both email and phone number exists, we are going to create a new secondary record, update old secondary records,   
    else if((emailExists || phoneNumberExists) && !(emailExists && phoneNumberExists)) {
      // Create new secondary contact
      const newContact = await this.databaseService.contact.create({
        data: {
          email: email,
          phoneNumber: phoneNumber,
          linkedId: primaryContact.id,
          linkPrecedence: "Secondary",
        },
      });

      // Update secondary contacts
      await this.databaseService.contact.updateMany({
        where: {
          id: {
            in: secondaryContacts.map(contact => contact.id),
          },
        },
        data: {
          linkedId: primaryContact.id,
          linkPrecedence: "Secondary"
        },
      });  

      //Update primary contacts  
      await this.databaseService.contact.update({
        where:{
          id:primaryContact.id
        },
        data:{
          linkPrecedence:"Primary"
        }
      })

      // Gather all unique emails and phone numbers
      const uniqueEmails = new Set(sortedContacts.map(contact => contact.email).filter(email => email));
      const uniquePhoneNumbers = new Set(sortedContacts.map(contact => contact.phoneNumber).filter(phoneNumber => phoneNumber));
      if (email) uniqueEmails.add(email);
      if (phoneNumber) uniquePhoneNumbers.add(phoneNumber);

      const secondaryContactIds = secondaryContacts.map(contact => contact.id);
      secondaryContactIds.push(newContact.id);

      return {
        contact: {
          primaryContactId: primaryContact.id,
          emails: Array.from(uniqueEmails),
          phoneNumbers: Array.from(uniquePhoneNumbers),
          secondaryContactIds: secondaryContactIds,
        }
      };
    }
  
}
}
