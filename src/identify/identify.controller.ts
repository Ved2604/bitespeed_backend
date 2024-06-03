import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { IdentifyService } from './identify.service';
import { CreateIdentifyDto } from './dto/create-identify.dto';
import { UpdateIdentifyDto } from './dto/update-identify.dto';

@Controller('identify')
export class IdentifyController {
  constructor(private readonly identifyService: IdentifyService) {}

  @Post()
  create(@Body() createIdentifyDto: CreateIdentifyDto) {
    return this.identifyService.create(createIdentifyDto);
  }

  @Get()
  findAll() { 
    let message={error:"This route doesn't have a GET method"}
    return message
  }
  @Get(':id')
  findOne(@Param('id') id: string) { 
    let message={error:"This route doesn't have a GET method"}
    return message
    
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateIdentifyDto: UpdateIdentifyDto) { 
    let message={error:"This route doesn't have a PATCH method"}
    return message
    
  }

  @Delete(':id')
  remove(@Param('id') id: string) { 
    let message={error:"This route doesn't have a DELETE method"} 
    return message
   
  }
}
