import { IsString, IsNotEmpty, IsEmail,IsPhoneNumber } from 'class-validator';

export class CreateIdentifyDto {
    @IsString()
    @IsNotEmpty()
    phoneNumber:string; 
    
    @IsEmail()
    @IsNotEmpty()
    email:string;

}
