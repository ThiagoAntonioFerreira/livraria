using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Web;

namespace LivrariaWeb.Models
{
    public class LivroModel
    {
        public int id_livro { get; set; }

        [Display(Name = "Titulo")]
        public string titulo { get; set; }

        [Display(Name = "Subtitulo")]
        public string subtitulo { get; set; }

        [Display(Name = "Sinopse")]
        public string sinopse { get; set; }

        [Display(Name = "Ano")]
        public int ano { get; set; }

        [Display(Name = "Categoria")]
        public string categoria { get; set; }

        [Display(Name = "Editora")]
        public string editora { get; set; }

        [Display(Name = "ISBN")]
        public string isbn { get; set; }
    }
}