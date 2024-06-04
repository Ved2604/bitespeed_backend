import { IsString, IsNotEmpty, IsEmail,IsPhoneNumber, IsNumberString } from 'class-validator';

export class CreateIdentifyDto { 
    
   @IsNumberString()
    phoneNumber:string; 
    
    @IsEmail()
    
    email:string;

}
