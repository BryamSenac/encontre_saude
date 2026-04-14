import { supabase } from '../config/supabaseClient.js';
import { authService } from './authService.js';

export const profileService = {
    // Buscar o perfil completo de saúde do usuário atual
    async getProfile() {
        try {
            // Primeiro identifica quem é o usuário logado no exato momento
            const { session, error: sessionError } = await authService.getUserSession();
            if (sessionError) throw sessionError;
            if (!session) throw new Error("Acesso negado: Usuário não está logado");

            const userId = session.user.id;

            // Busca na tabela do painel do Supabase
            const { data, error } = await supabase
                .from('perfis_saude')
                .select('*')
                .eq('id', userId)
                .single(); // Pegamos apenas um registro, pois 1 id = 1 perfil

            // Lidar graciosamente quando ele não achar resultados (Isso acontece com usuários novos que acabaram de criar a conta e não preencheram a ficha ainda). PGRST116 é o erro interno do Supabase pra 'No rows found'.
            if (error && error.code !== 'PGRST116') {
                throw error;
            }

            return { profile: data, error: null };
        } catch (error) {
            console.error("Erro no getProfile:", error.message);
            return { profile: null, error };
        }
    },

    // Salva (cria ou atualiza) os dados através da função upsert (update/insert)
    async saveProfile(profileData) {
        try {
            // Identifica quem está logado
            const { session, error: sessionError } = await authService.getUserSession();
            if (sessionError) throw sessionError;
            if (!session) throw new Error("Acesso negado: Usuário não está logado");

            const userId = session.user.id;

            // Monta o objeto que o banco espera, efetuando o type casting das variáveis da tela e associando seu ID
            const updates = {
                id: userId,
                idade: typeof profileData.idade === 'number' ? profileData.idade : null,
                peso: typeof profileData.peso === 'number' ? profileData.peso : null,
                altura: typeof profileData.altura === 'number' ? profileData.altura : null,
                fuma: Boolean(profileData.fuma), // Garante que será salvo como true ou false
                bebe: Boolean(profileData.bebe),
                alergia_medicamento: profileData.alergia_medicamento || '', // Se vier nulo, envia uma string vazia
                possui_deficiencia: profileData.possui_deficiencia || '',
                contato_medico: profileData.contato_medico || '',
                updated_at: new Date()
            };

            const { data, error } = await supabase
                .from('perfis_saude')
                .upsert(updates) // A mágica do Upsert: "Se o id existir, ele edita a ficha antiga. Se for não existir, ele é nova ficha, então Cria".
                .select()
                .single();

            if (error) throw error;
            return { profile: data, error: null };
        } catch (error) {
            console.error("Erro no saveProfile:", error.message);
            return { profile: null, error };
        }
    }
};
