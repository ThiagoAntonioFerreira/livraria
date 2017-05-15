
CREATE TABLE [dbo].[livros](
	[id_livro] [int] IDENTITY(1,1) NOT NULL,
	[titulo] [varchar](100) NOT NULL,
	[subtitulo] [varchar](100) NOT NULL,
	[sinopse] [varchar](max) NOT NULL,
	[ano] [int] NOT NULL,
	[categoria] [varchar](100) NULL,
	[editora] [varchar](100) NULL,
	[isbn] [varchar](20) NULL,
 CONSTRAINT [PK_livros] PRIMARY KEY CLUSTERED 
(
	[id_livro] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON) ON [PRIMARY]
) ON [PRIMARY] TEXTIMAGE_ON [PRIMARY]

GO

SET ANSI_PADDING OFF
GO


using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace LivrariaEntity.Script
{
    class Class1
    {
    }
}
