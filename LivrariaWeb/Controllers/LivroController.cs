using AutoMapper;
using LivrariaDAO;
using LivrariaEntity.Model;
using LivrariaWeb.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;

namespace LivrariaWeb.Controllers
{
    public class LivroController : Controller
    {
        // GET: Livro
        public LivroController()
        {
            Mapper.Initialize(cfg =>
            {
                cfg.CreateMap<LivroModel, livros>();
                cfg.CreateMap<livros, LivroModel>();
            });

        }
        // GET: Cliente
        public ActionResult Index()
        {
            List<LivroModel> lentidade = Mapper.Map<List<livros>, List<LivroModel>>(new LivrosDAO().GetAll());

            return View(lentidade);
        }

        public ActionResult Livro(int id = 0)
        {
            LivroModel ent = new LivroModel();
            if (id != 0)
            {
                ent = Mapper.Map<livros, LivroModel>(new LivrosDAO().GetById(id));
            }
            return View(ent);
        }

        public ActionResult Visualizar(int id)
        {
            LivroModel ent = Mapper.Map<livros, LivroModel>(new LivrosDAO().GetById(id));
            
            return View(ent);
        }

        public ActionResult Salvar(LivroModel model)
        {
            livros ent = Mapper.Map<livros>(model);
            if (model.id_livro > 0)
                new LivrosDAO().Atualizar(ent);
            else
                new LivrosDAO().Salvar(ent);

            return RedirectToAction("Index");
        }

        public ActionResult Excluir(LivroModel model)
        {
            new LivrosDAO().Excluir(model.id_livro);
            
            return RedirectToAction("Index");
        }
    }
}