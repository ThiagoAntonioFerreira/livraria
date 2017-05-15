using LivrariaEntity.Model;
using System;
using System.Collections.Generic;
using System.Data.Entity;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace LivrariaDAO 
{
   public class LivrosDAO
        {

            private livrariaEntities context = new livrariaEntities();
            public LivrosDAO()
            {
            }

            public List<livros> GetAll()
            {
                return context.livros.ToList();
            }

            public livros GetById(int Id)
            {
                return context.livros.Where(x => x.id_livro == Id).FirstOrDefault();
            }

            public void Atualizar(livros entidade)
            {
                using (context = new livrariaEntities())
                {
                    context.Entry(entidade).State = EntityState.Modified;
                    context.SaveChanges();
                }
            }

            public void Excluir(int id)
            {
                using (context = new livrariaEntities())
                {
                    var a = context.livros.First(x => x.id_livro == id);
                    context.Set<livros>().Remove(a);
                    context.SaveChanges();
                }
            }

            public void Salvar(livros entidade)
            {
                using (context = new livrariaEntities())
                {
                    context.livros.Add(entidade);
                    context.SaveChanges();
                }
            }
        }
}
