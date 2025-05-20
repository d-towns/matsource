import { createSupabaseSSRClient } from "../supabase/ssr";

export class UserService {
  static async getUser() {
    const supabase = await createSupabaseSSRClient();
    const {data: {user}} = await supabase.auth.getUser();
    const { data, error } = await supabase.from('users').select('*').eq('id', user.id).single();
    if (error) {
      throw new Error(error.message);
    }
    return data;
  }
}
