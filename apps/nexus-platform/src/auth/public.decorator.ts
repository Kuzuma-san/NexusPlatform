// In AuthModule we implemented App_Guard which made our custom authguard implemented across all endpoints
//Now we create a @Public Decorator so that the endpoints with this decorator doesnt need the token
//We implement this in our AuthGuard to return true if @Public is provided without checking token 

import { SetMetadata } from '@nestjs/common';

export const IS_PUBLIC_KEY = 'isPublic';
export const Public = () => SetMetadata(IS_PUBLIC_KEY, true);
