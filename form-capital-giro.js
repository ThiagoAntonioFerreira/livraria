// ##############################
//FIELD MAP
// ##############################
const fields = {
    OperacoesCliente: "#OperacoesCliente",
    produtoId: "#ProdutoId",
    Cliente: "#CodigoCliente",
    CNPJ: "#CNPJ",
    Tipo: "#Tipo",
    NroBoleto: "#NroBoleto",
    Sequencial: "#Sequencial",
    FluxoPagamento: "#FluxoPagamento",
    DataInicio: "#DataInicio",
    PrazoDC: "#PrazoDC",
    PrazoDU: "#PrazoDU",
    DataVencimento: "#DataVencimento",
    ValorOperacao: "#ValorOperacao",
    TaxaJuros: "#TaxaJuros",
    PorcentagemIndice: "#PorcentagemIndice",
    Indice: "#Indice",
    BaseRate: "#BaseRate",
    BaseRateIndice: "#BaseRateIndice",
    PorcentagemConsumoCapital: "#PorcentagemConsumoCapital",
    AreaMesa: "#AreaMesa",
    Periodicidade: "#Periodicidade",
    TipoTaxa: "#TipoTaxa",
    PagamentoJuros: "#PagamentoJuros",
    PeriodicidadeParcelas: "#PeriodicidadeParcelas",
    UnidadePeriodicidadeParcelas: "#UnidadePeriodicidadeParcelas",
    AreaResponsavelProduto: "#AreaResponsavelProduto",
    AreaResponsavelFunding: "#AreaResponsavelFunding",
    ValorLiquido: "#ValorLiquido",
    PorcentagemIOF: "#PorcentagemIOF",
    ValorIOF: "#ValorIOF",
    Periodicidade3: "#Periodicidade3",
    ResgateAntecipado: "#ResgateAntecipado",
    DataBase: "#DataBase",
    IGPM: "#IGPM",
    DataReset: "#DataReset",
    DiaAniversario: "#DiaAniversario",
    TaxaTransferencia: "#TaxaTransferencia",
    Indice: "#Indice",
    TaxaTransferenciaIndice: "#TaxaTransferenciaIndice",
    PeriodicidadeFunding: "#PeriodicidadeFunding",
    ValorPagoCliente: "#ValorPagoCliente",
    LiquidacaoCPMF: "#LiquidacaoCPMF",
    LiquidacaoCPMFIOF: "#LiquidacaoCPMFIOF",
    LiquidacaoPrincipalAmortizado: "#LiquidacaoPrincipalAmortizado",
    LiquidacaoJurosAmortizado: "#LiquidacaoJurosAmortizado",
    TipoTaxa: "#TipoTaxa",
    ValorFuturo: "#ValorFuturo",
    HorarioNegociacao: "#HorarioNegociacao",
    ContratoHistorico: "#ContratoHistorico",
    CarteiraNegociacao: "#CarteiraNegociacao",
    FluxoCaixa: "#FluxoCaixa",
    CategoriaInstrumentoFinanceiro: "#CategoriaInstrumentoFinanceiro",
    FundingTaxaTransferencia: "#FundingTaxaTransferencia",
    FundingIndice: "#FundingIndice",
    PeriodicidadeTaxaJuros: "#PeriodicidadeTaxaJuros",
    FundingPeriodicidade: "#FundingPeriodicidade",
    LiquidacaoModeloContrato: "#LiquidacaoModeloContrato",
    FundingTaxaTransferenciaIndice: "#FundingTaxaTransferenciaIndice",
    LiquidacaoValorPagoCliente: "#LiquidacaoValorPagoCliente",
    ValorComissaoIntermediacao: "#ValorComissaoIntermediacao",
    PercIndice: "#PercIndice"
}
// ##############################
//VARIAVEIS GLOBAIS
// ##############################

const now = new Date();
const select2_options =
{
    mount(options) {
        return Object.assign({
            language: "pt-BR",
            width: "100%",
            dropdownAutoWidth: true,
            placeholder: "Selecione",
        }, options)
    },
    client() {
        return this.mount({
            minimumInputLength: 3,
            ajax: {
                url: "/select2/searchclientedocumento",
                method: "get",
                dataType: "json"
            }
        })
    },
}
const tableOperation = $("#tableOperacoes").DataTable({
    sDom: 't',
    language: DATATABLES_LANG_PT_BR,
    paging: false,
    searching: true,
    data: [],
    pageLength: 50,
    order: [[0, "desc"], [1, "asc"], [2, "asc"]],
    columns: [
        {
            data: "nroBoleto",
        },
        {
            data: "valorOperacao",
            render: (data) => {
                const n = new Number(parseFloat(data));
                return n.formatMoney();
            },
        },
        {
            data: "dataInicio",
            render: (data) => formatDate(data, "dd/mm/yyyy"),
            type: "date-br",
        },
        {
            data: "dataVencimento",
            render: (data) => formatDate(data, "dd/mm/yyyy"),
            type: "date-br",
        }

    ],
    createdRow: function (row, data, dataIndex) {
        $(row).css("cursor", "pointer");
        $(row).on("click", () => {
            $("#modal-operacoes").modal("hide");
            $("#NroBoleto").val(data.numeroBoleto);
            API_FUNCTIONS.findOperation(data.id);
            // refreshFormMasks();
        });
    }
});

// ##############################
//FUNCOES
// ##############################
const mountDataForm = () => {
    const data = mountJsonByForm($(`#formCapitalGiro`));
    data.Valores = getItemsFormTable("items", "data-id");
    data.Propostas = getItemsFormTable("propostas", "data-id");
    data.Garantias = getItemsFormTable("garantias", "data-id");

    return data;
}
const FUNCTIONS = {
    setNDays($el, onChange) {
        const ndays = $el.find(".ndays");
        $el.find("select").on("change", (evt) => {
            const target = $(evt.currentTarget);
            ndays.val("")
            ndays.hide()
            if (target.val() == "n") {
                ndays.prop("disabled", false);
                ndays.show()
            }
            else onChange(target.val())

        })

        ndays.on("blur", (evt) => {
            onChange(ndays.val());
        })
    },

    async getCamposBoleto(productId) {

        var tipoBoleto = '00056';

        const resCampos = await ApiHelper.get("/ConfiguracaoTab/ConsultaCamposBoletoTab?tipoBoletoId=" + tipoBoleto + "&produtoId=" + $(fields.produtoId).val())

        if (resCampos.success == false) {
            return toastr.warning(resCampos.message);
        } else {
            var dataArray = JSON.parse(resCampos.data);

            TabHelpers.disableTab()
            TabHelpers.setTabFields(dataArray)
            TabHelpers.init();
        }
    },

    async carregaAreaResponsavelProduto(cliente) {
        const areaDefault = await ApiHelper.get("/Boletos/CapitalGiro/ObterAreaResponsavelProdutoDefault?cliente=" + cliente)
        console.log(areaDefault);
        if (areaDefault != null && areaDefault.data != null && areaDefault.success) {
            $("#AreaResponsavelProduto").val(areaDefault.data.codigo).trigger("change");
        }
    },
}

// ##############################
//API Functions
// ##############################
const API_FUNCTIONS = {
    async drawOperationsByClient(client) {
        tableOperation.clear(client);
        let data = await this.getOperationsByClient(client);
        data = data == null ? [] : data.dados;
        tableOperation.rows.add(data);
        tableOperation.draw();
    },
    async findOperation(operationId) {
        setTimeout(() => {
            window.location.href = "/boletos/capitalgiro/RenovaBoleto/" + operationId;
        }, 500);
    },
    async getOperationsByClient(client) {
        return await ApiHelper.get("/boletos/capitalGiro/RetornaDadosBoletoPorCliente?codigoCliente=" + client.id, client);

    },
    async sendForm(onSuccess = (ret) => { }) {
        const dados = mountDataForm();
        var totalFiles = document.getElementById("FileUpload").files.length;

        for (var i = 0; i < totalFiles; i++) {
            var file = document.getElementById("FileUpload").files[i];
            dados.NomeArquivo = file.name;
            dados.Arquivo = await toBase64(file);
        }
        if ($("#formCapitalGiro").valid()) {
            try {
                const ret = await ApiHelper.post("/boletos/capitalgiro/create", dados, {
                    loading: { message: "Salvando Boleto, Aguarde..." },
                    headers: {
                        RequestVerificationToken:
                            $('input:hidden[name="__RequestVerificationToken"]').val()
                    },
                });
                if (ret.success) {
                    $.each(ret.message, function (code, messages) {
                        toastr.success(messages.message);
                    });
                    onSuccess(ret);
                } else {

                    $.each(ret.message, function (code, messages) {
                        toastr.warning(messages.message);
                    });
                }
            } catch (e) {
                toastr.warning("Não foi possível salvar o boleto!");
            }

        } else {
            toastr.warning("Verifique o preenchimento de todos os campos obrigatórios");
        }
    },
    async enviarInterfaceBackOffice() {
        var id = $("#Id").val();

        var dados = { operacaoBoletoDetalheId: id, observacao: $("#Observacao").val(), faseAtual: $("#FaseAtual").val() };
        await ApiHelper.post("/Boletos/capitalgiro/EnviarInterfaceBackOffice",
            dados, {
            loading: { message: "Enviando Interface BackOffice, Aguarde..." },
            headers: {
                RequestVerificationToken:
                    $('input:hidden[name="__RequestVerificationToken"]').val()
            },
        });
        location.reload();
    },
    async aprovarCapitalGiro(aprovarComIrregularidade, irregularidades) {
        var id = $("#Id").val();
        $.ajax({
            url: "/boletos/capitalgiro/aprovar",
            type: "POST",
            data: { operacaoBoletoDetalheId: id, observacao: $("#Observacao").val(), faseAtual: $("#FaseAtual").val(), irregularidades: irregularidades, aprovarComIrregularidade: aprovarComIrregularidade },
            dataType: "json",
            contentType: "application/x-www-form-urlencoded",
            error: function (ret) {
                $(":loading").loading("stop");
            },
            beforeSend: function () {
                $("body").loading({
                    stoppable: false,
                    theme: 'light',
                    message: "Aprovando Boleto, Aguarde..."
                });
            },
            success: function (ret) {
                $("#Id").val(ret.id);
                if (ret.success) {
                    $.each(ret.message, function (code, messages) {
                        $(":loading").loading("stop");
                        setTimeout(function () { $(":loading").loading("stop") }, 500);
                        toastr.success(messages.message);
                        setTimeout(() => {
                            window.location.href = "/boletos/capitalgiro/edit/" + ret.id;
                        }, 500);

                    });
                } else {
                    $(":loading").loading("stop");
                    setTimeout(function () { $(":loading").loading("stop") }, 500);
                    $.each(ret.message, function (code, messages) {
                        toastr.warning(messages.message);
                        location.reload();
                    });
                }
            }
        });
    },
    async sendReprovarCapitalGiro() {
        $(`#modal-reprovar form`).each((i, el) => {
            if (el.checkValidity()) {
                const data = mountJsonByForm($(`#modal-reprovar`));
                $("#modal-reprovar").modal("hide");

                var id = $("#Id").val();
                $.ajax({
                    url: "/boletos/capitalgiro/reprovar",
                    type: "POST",
                    data: { operacaoBoletoDetalheId: id, observacao: $("#Observacao").val(), faseAtual: $("#FaseAtual").val(), motivoReprovacaoId: $("#motivo-reprovar").val() },
                    dataType: "json",
                    contentType: "application/x-www-form-urlencoded",
                    error: function (ret) {
                        $(":loading").loading("stop");
                    },
                    beforeSend: function () {
                        $("body").loading({
                            stoppable: false,
                            theme: 'light',
                            message: "Reprovando Boleto, Aguarde..."
                        });
                    },
                    success: function (ret) {
                        $(":loading").loading("stop");
                        setTimeout(function () { $(":loading").loading("stop"); }, 500);
                        location.reload();

                    }
                });

            }
            el.classList.add('was-validated');
        })
    },
    async SendDuplicarBoletoCapitalGiro() {
        var id = $("#Id").val();
        window.open("/Boletos/capitalgiro/Duplicate/" + id, "_blank");
    },
    async getCamposBoleto() {

        var tipoBoleto = '00056';

        const resCampos = await ApiHelper.get("/ConfiguracaoTab/ConsultaCamposBoletoTab?tipoBoletoId=" + tipoBoleto + "&produtoId=" + $(fields.ProdutoId).val())

        if (resCampos.success == false) {
            return toastr.warning(resCampos.message);
        } else {
            var dataArray = JSON.parse(resCampos.data);

            TabHelpers.setTabFields(dataArray)
            TabHelpers.init();
        }
    },
    async calcVencimento() {
        if ($(fields.DataInicio).valDate() != "" && $(fields.PrazoDC).val() >= 0) {
            const dados = await ApiHelper.get("/Boletos/CapitalGiro/CalcularVencimento?dataInicio=" + $(fields.DataInicio).valDate() +
                "&prazo=" + $(fields.PrazoDC).val())

            if (dados.success == false) {
                toastr.warning(dados.message);
                $(fields.DataVencimento).valDate("");
                $(fields.PrazoDC).val(0);
                $(fields.PrazoDU).val(0);
            } else {
                if (dados.data.proximoDiaUtil.substr(0, 10) != dados.data.dataFim.substr(0, 10)) {
                    await confirmModalVencimento(() => {
                        $(fields.DataVencimento).valDate(dados.data.proximoDiaUtil.substr(0, 10))
                        $(fields.PrazoDC).val(dados.data.totalDiasCorridos);
                        $(fields.PrazoDU).val(dados.data.totalDiasUteis);
                        toastr.warning("A data de vencimento foi recalculada");
                    });
                } else {
                    var data = new Date(dados.data.dataFim);
                    $(fields.DataVencimento).valDate(formatDate(data, "dd/mm/yyyy"));
                    $(fields.PrazoDC).val(dados.data.totalDiasCorridos);
                    $(fields.PrazoDU).val(dados.data.totalDiasUteis);
                }
            }

            return true;
        }
        else
            toastr.warning("Para calcular a data de vencimento é necessário informar data de início e prazo");

        return false;
    },
    async calcDataInicio() {
        const dtInicio = $(fields.DataInicio).valDate();

        if (dtInicio != "") {
            const dados = await ApiHelper.get("/Boletos/CapitalGiro/CalcularDiaUtilDataInicio?dataInicio=" + dtInicio)

            if (dados != null) {
                if (dados.data != null) {
                    if (dados.data.proximoDiaUtil.substr(0, 10) != dtInicio) {
                        await confirmModalVencimento(() => {
                            $(fields.DataInicio).valDate(dados.data.proximoDiaUtil.substr(0, 10))
                        });
                    }

                    if ($(fields.PrazoDC).val() > 0)
                        await API_FUNCTIONS.calcVencimento()
                }
            }
            if (dados.success == false) {
                toastr.warning(dados.message);
                $(fields.DataInicio).valDate(formatDate(now, "dd/mm/yyyy"))
            }

            return true;
        }
        return false;
    },
    async calcDataBase() {
        const dtBase = $(fields.DataBase).valDate();

        if (dtBase != "") {
            const dados = await ApiHelper.get("/Boletos/CapitalGiro/CalcularDiaUtilDataInicio?dataInicio=" + dtBase)

            if (dados != null) {
                if (dados.data != null) {
                    if (dados.data.proximoDiaUtil.substr(0, 10) != dtBase) {
                        await confirmModalVencimento(() => {
                            $(fields.DataBase).valDate(dados.data.proximoDiaUtil.substr(0, 10))
                        });
                    }
                }
            }
            if (dados.success == false) {
                toastr.warning(dados.message);
                $(fields.DataBase).valDate(formatDate(now, "dd/mm/yyyy"))
            }

            return true;
        }
        return false;
    },
    async calcDataReset() {
        const dtReset = $(fields.DataReset).valDate();

        if (dtReset != "") {
            const dados = await ApiHelper.get("/Boletos/CapitalGiro/CalcularDiaUtilDataInicio?dataInicio=" + dtReset)

            if (dados != null) {
                if (dados.data != null) {
                    if (dados.data.proximoDiaUtil.substr(0, 10) != dtReset) {
                        await confirmModalVencimento(() => {
                            $(fields.DataReset).valDate(dados.data.proximoDiaUtil.substr(0, 10))
                        });
                    }
                }
            }
            if (dados.success == false) {
                toastr.warning(dados.message);
                $(fields.DataReset).valDate(formatDate(now, "dd/mm/yyyy"))
            }

            return true;
        }
        return false;
    },

    async findOperation(operationId) {
        if (operationId) {
            //console.log(operationId);

            window.location.href = "/boletos/capitalgiro/RetornaBoletoRenovacao?id=" + operationId;

            
        }
    },
}

// ##############################
//JQUERY ACOES
// ##############################


$(document).ready(() => {
    Init.field($(fields.Cliente), (f) => {
        f.select2(select2_options.client()).val(ResHelper.get("CodigoCliente")).trigger("change");
        f.on('select2:select', (e) => {
            $(fields.CNPJ).val(e.params.data.dado.cnpj);
            FUNCTIONS.carregaAreaResponsavelProduto(e.params.data.id);
        });
    });

    Init.field($(fields.OperacoesCliente), (f) => {
        f.select2(Helpers.select2Options.mount({
        })).val("").trigger("change");
        f.on("select2:select", (evt) => {
            API_FUNCTIONS.drawOperationsByClient(evt.params.data);
        })
    });

    Init.field($(fields.Sequencial), (f) => {
        f.css("color", "blue");
    });


    Init.field($(fields.PercIndice), (f) => {
        f.on("blur", async () => {
            //validaTaxaJuros();
            validaPercIndice();
            //validaBaseRate();
        });
    });


    Init.field($("#showOperacoes"), (f) => {
        f.on("click", () => {
            $("#modal-operacoes").modal("show");
            $(fields.operacoesCliente).select2('open');
        })
        f.focus();
    });

    Init.field($(fields.DataInicio), (f) => {
        f.on("change", (evt) => {
            el = $(evt.currentTarget);
            if (el.valDate().length == 10) {
                const d = new Date(el.valDate());
                const n = Date.nowWithoutTime();
                if (d < n) {
                    customModalConfirm({
                        message: "Data de início menor que data atual. Deseja prosseguir?",
                        onConfirm: () => {
                            API_FUNCTIONS.calcDataInicio()
                        },
                        onCancel: () => {
                            f.valDate(formatDate(new Date(), "dd/mm/yyyy"));
                            API_FUNCTIONS.calcDataInicio()
                        }
                    });
                }
                const inicio = new Date($("#DataInicio").valDate());

                if (inicio >= now) {
                    API_FUNCTIONS.calcDataInicio()
                }
            }
            API_FUNCTIONS.calcVencimento()
        })
        /*f.val(formatDate(now, "dd-mm-yyyy"))*/
    });
    Init.field($(fields.PrazoDC), (f) => {
        f.on("change", async () => {
            await API_FUNCTIONS.calcVencimento();
        });
    });
    //Init.field($(fields.dataVencimento), (f) => {
    //    f.on("change", async (evt) => {
    //        await API_FUNCTIONS.calcPrazoDC();
    //    });
    //});


    Init.field($(fields.ClienteRisco), (f) => {
        f.select2(Helpers.select2Options.mount({})).val("").trigger("change");
    });

    Init.field($(fields.Indice), (f) => {
        f.on("change", () => {
            $(fields.FundingIndice).val($(fields.Indice).val()).trigger("change");
            if (f.val() == "041" || f.val() == "051") {
                $("#div-periodicidade").show();

                const resCampos =
                    $.ajax({
                        type: "GET",
                        contentType: "application/json",
                        url: "/boletos/CapitalGiro/GetIGPM?codigo=" + f.val(),
                        success: function (ret) {
                            $(fields.IGPM).val(ret.data.valind).trigger("blur");
                        }
                    });

            } else if (f.val() == "019") {
                $("#AreaMesa").select2(Helpers.select2Options.mount({})).val("FM").trigger("change");
            }else {
                $("#div-periodicidade").hide();
            }
        });

        f.select2(Helpers.select2Options.mount({})).val(ResHelper.get("Indice")).trigger("change");
    });

    Init.field($(fields.FundingIndice), (f) => {
        f.select2(Helpers.select2Options.mount({})).val(ResHelper.get("FundingIndice")).trigger("change");
    });

    Init.field($(fields.LiquidacaoModeloContrato), (f) => {
        f.select2(Helpers.select2Options.mount({})).val(ResHelper.get("LiquidacaoModeloContrato")).trigger("change");
    });    

    Init.field($(fields.FundingPeriodicidade), (f) => {
        f.select2(Helpers.select2Options.mount({})).val(ResHelper.get("FundingPeriodicidade")).trigger("change");
    });

    Init.field($(fields.CarteiraNegociacao), (f) => {
        f.select2(Helpers.select2Options.mount({})).val(ResHelper.get("CarteiraNegociacao")).trigger("change");
    });

    Init.field($(fields.NroBoleto), (f) => {
        f.on("change", () => {
            API_FUNCTIONS.findOperation(f.val());  
        });
    });


    Init.field($(fields.Tipo), (f) => {
        f.on("change", () => {
            if (f.val() == "N") {
                $(fields.NroBoleto).prop("disabled", true);
                

                $("#div-showOperacoes").hide();
                $("#div-valorpagocliente").hide();
                $("#div-principalamortizado").hide();
                $("#div-jurosamortizado").hide();
            } else {
                $(fields.NroBoleto).prop("disabled", false);

                $("#div-showOperacoes").show();
                $("#div-valorpagocliente").show();
                $("#div-principalamortizado").show();
                $("#div-jurosamortizado").show();
                $(fields.NroBoleto).val("").focus();
            }
        });
        f.trigger("change");
    });

    Init.field($(fields.DataBase), (f) => {

        f.on("change", (evt) => {
            el = $(evt.currentTarget);
            if (el.valDate().length == 10) {
                const d = new Date(el.valDate());
                const n = Date.nowWithoutTime();
                if (d < n) {
                    customModalConfirm({
                        message: "Data de início menor que data atual. Deseja prosseguir?",
                        onConfirm: () => {
                            API_FUNCTIONS.calcDataBase()
                        },
                        onCancel: () => {
                            f.valDate(formatDate(new Date(), "dd/mm/yyyy"));
                            API_FUNCTIONS.calcDataBase()
                        }
                    });
                }
                const inicio = new Date($(fields.DataBase).valDate());
                if (inicio >= now) {
                    API_FUNCTIONS.calcDataBase()
                }
            }

        })
    });

    Init.field($(fields.DataReset), (f) => {

        f.on("change", (evt) => {
            el = $(evt.currentTarget);
            if (el.valDate().length == 10) {
                const d = new Date(el.valDate());
                const n = Date.nowWithoutTime();
                if (d < n) {
                    customModalConfirm({
                        message: "Data de início menor que data atual. Deseja prosseguir?",
                        onConfirm: () => {
                            API_FUNCTIONS.calcDataReset()
                        },
                        onCancel: () => {
                            f.valDate(formatDate(new Date(), "dd/mm/yyyy"));
                            API_FUNCTIONS.calcDataReset()
                        }
                    });
                }
                const inicio = new Date($(fields.DataReset).valDate());
                if (inicio >= now) {
                    API_FUNCTIONS.calcDataReset()
                }
            }

        })
    });

    Init.field($(fields.DiaAniversario), (f) => {

        f.on("change", (evt) => {
            el = $(evt.currentTarget);
            if (el.val() < 0 || el.val() > 31) {
                toastr.warning("Dia de Aniversário deve ser entre 1 e 31.");
                $(fields.DiaAniversario).val("");
            }
        });
    });

    Init.field($(fields.BaseRate), (f) => {
        f.on("change", (evt) => {
            el = $(evt.currentTarget);
            if (el.val()) {
                $(fields.FundingTaxaTransferencia).val(el.val()).trigger("change");
            }
        });

        f.on("blur", (evt) => {
            //validaTaxaJuros();
            //validaPercIndice();
            validaBaseRate();
        });
    });

    Init.field($(fields.BaseRateIndice), (f) => {
        f.on("change", (evt) => {
            el = $(evt.currentTarget);
            if (el.val()) {
                $(fields.FundingTaxaTransferenciaIndice).val($(fields.BaseRateIndice).val()).trigger("blur");
            }
        });

        f.on("blur", (evt) => {
            //validaTaxaJuros();
            //validaPercIndice();
            //validaBaseRate();
            validaBaseRateIndice();
        });
    });

    Init.field($(fields.Periodicidade), (f) => {
        f.select2(Helpers.select2Options.mount({})).val(ResHelper.get("Periodicidade")).trigger("change");
    });

    Init.field($(fields.FluxoCaixa), (f) => {
        f.select2(Helpers.select2Options.mount({})).val(ResHelper.get("FluxoCaixa")).trigger("change");
    });    

    Init.field($(fields.UnidadePeriodicidadeParcelas), (f) => {
        f.select2(Helpers.select2Options.mount({})).val(ResHelper.get("UnidadePeriodicidadeParcelas")).trigger("change");
    });

    Init.field($(fields.PeriodicidadeParcelas), (f) => {
        var propostas = getItemsFormTable("propostas", "data-id");
        var parcelas = propostas.length

        if (parcelas == 0)
            f.val("1");
        else
            f.val(parcelas);
    });

    Init.field($(fields.Periodicidade3), (f) => {
        f.select2(Helpers.select2Options.mount({})).val("").trigger("change");
    });

    Init.field($(fields.Moeda), (f) => {
        f.select2(Helpers.select2Options.mount({})).val("0").trigger("change");
    });

    Init.field($(fields.PagamentoJuros), (f) => {
        f.select2(Helpers.select2Options.mount({})).val(ResHelper.get("PagamentoJuros")).trigger("change");
    });

    Init.field($(fields.TipoTaxa), (f) => {
        f.select2(Helpers.select2Options.mount({})).val(ResHelper.get("TipoTaxa")).trigger("change");
    });
    Init.field($(fields.AreaMesa), (f) => {
        f.select2(Helpers.select2Options.mount({})).val(ResHelper.get("AreaMesa")).trigger("change");
    });
    Init.field($(fields.AreaResponsavelProduto), (f) => {
        f.select2(Helpers.select2Options.mount({})).val(ResHelper.get("AreaResponsavelProduto")).trigger("change");
    });
    Init.field($(fields.AreaResponsavelFunding), (f) => {
        f.select2(Helpers.select2Options.mount({})).val(ResHelper.get("AreaResponsavelFunding")).trigger("change");
    });
    Init.field($(fields.PeriodicidadeTaxaJuros), (f) => {
        f.select2(Helpers.select2Options.mount({})).val(ResHelper.get("PeriodicidadeTaxaJuros")).trigger("change");

        f.on("change", () => {
            $(fields.UnidadePeriodicidadeParcelas).select2(Helpers.select2Options.mount({})).val($(fields.PeriodicidadeTaxaJuros).val()).trigger("change");
            $(fields.FundingPeriodicidade).select2(Helpers.select2Options.mount({})).val($(fields.PeriodicidadeTaxaJuros).val()).trigger("change");
        })
    });

    Init.field($(fields.TaxaJuros), (f) => {
        f.on("blur", () => {
            calcularValorFuturo();
            validaPercIndice();
            validaBaseRate();
        })
    });



    Init.field($(fields.HorarioNegociacao), (f) => {
        f.val(formatDate(now, "h:i"))
    });

    Init.field($("#addItem"), (f) => {
        f.on("click", () => {
            tableItem.add({ new: true, DataVerificacao: "", ValorReferencia: "" });
        })
    })

    Init.field($("#orderItem"), (f) => {
        f.on("click", () => {
            tableItem.drawOrder();
        })
    })

    Init.field($(fields.ValorOperacao), (f) => {
        f.on("blur", () => {
            calcularIOF();
            calcularValorLiquido();
            calcularValorFuturo();
        })
    });

    Init.field($(fields.ValorComissaoIntermediacao), (f) => {
        f.on("blur", () => {
            calcularValorLiquido();
        })
    });

});




// ##############################
//INIT
// ##############################

$(document).ready(() => {
    updateFormMasks();

    FUNCTIONS.getCamposBoleto();

    setTimeout(() => {
        $(fields.Cliente).focus();
    }, 200);

});


const sendForm = async () => {
    //Taxa Juros - Obrigatório: Se o % Índice não estiver preenchido e / ou a Base Rate estiver preenchida.
    if ((Convert.moneyToNumber($(fields.TaxaJuros).val()) < 0) && (Convert.moneyToNumber($(fields.TaxaJuros).val()) > 100)) {
        toastr.warning("Taxa juros não pode ser menor que 0 nem maior que 100.");
        return;
    }

    //Fluxo de Pagamento
    var confirmacao = false;
    var fluxoPagamento = getItemsFormTable("propostas", "data-id").length;
    if (fluxoPagamento > 0) {

        var totalAmortizacao = $("#totalAmortizacao").html();
        var valorOperacao = $("#ValorOperacao").val();

        if (Convert.NumberToDecimal(totalAmortizacao) != Convert.NumberToDecimal(valorOperacao))
            confirmacao = true;
    }

    if (confirmacao) {
        await customModalConfirm({
            message: "A soma do Valor Amortização está diferente do Valor da Operação. Deseja prosseguir?",
            onConfirm: () => {
                API_FUNCTIONS.sendForm((ret) => {
                    window.location.href = "/boletos/capitalgiro/edit/" + ret.id;
                });
            },
            onCancel: () => {
                return;
            }
        });
    } else {
        API_FUNCTIONS.sendForm((ret) => {
            window.location.href = "/boletos/capitalgiro/edit/" + ret.id;
        });
    }
}

const sendFormEnviarAprovacao = async () => {
    enviarAprovacao();
}

const enviarAprovacao = async () => {
    sendFormValidation((ret) => {
        let notificacoes = [];
        let irregularidades = [];

        //console.log('retorno RET');
        //console.log(ret);
        if (ret?.notificacao != null) {
            for (const m of ret.notificacao) {
                notificacoes.push({
                    message: m.message,
                    type: "warning"
                });
                irregularidades.push(m.message);
            }

            customModalConfirm({
                title: "",
                messagesList: notificacoes,
                onConfirm: () => {
                    API_FUNCTIONS.aprovarCapitalGiro(true, irregularidades);
                }
            })
        }

        else {
            $("body").loading({ message: "Carregando..." });
            window.open("/Boletos/capitalgiro", "_blank");
            setTimeout(() => {
                window.location.href = "/Boletos/capitalgiro/Edit/" + ret.id;
            }, 500);
        }
    });
}

const sendFormValidation = async (onSuccess = (ret) => { }) => {
    const dados = mountDataForm();

    var totalFiles = document.getElementById("FileUpload").files.length;

    for (var i = 0; i < totalFiles; i++) {
        var file = document.getElementById("FileUpload").files[i];
        dados.NomeArquivo = file.name;
        dados.Arquivo = await toBase64(file);
    }

    if ($("#formCapitalGiro").valid()) {

        try {
            //Fluxo de Pagamento
            var confirmacao = false;
            var fluxoPagamento = getItemsFormTable("propostas", "data-id").length;
            if (fluxoPagamento > 0) {

                var totalAmortizacao = $("#totalAmortizacao").html();
                var valorOperacao = $("#ValorOperacao").val();

                if (Convert.NumberToDecimal(totalAmortizacao) != Convert.NumberToDecimal(valorOperacao))
                    confirmacao = true;
            }
            //console.log(confirmacao);
            if (confirmacao) {
                await customModalConfirm({
                    message: "A soma do Valor AmortizaÃ§Ã£o estÃ¡ diferente do Valor da OperaÃ§Ã£o. Deseja prosseguir?",
                    onConfirm: () => {

                        const ret = ApiHelper.post("/boletos/capitalgiro/create", dados, {
                            loading: { message: "Salvando Boleto, Aguarde..." },
                            headers: {
                                RequestVerificationToken:
                                    $('input:hidden[name="__RequestVerificationToken"]').val()
                            },
                        });
                        if (ret.success) {
                            $("#Id").val(ret.id);
                            $("#FaseAtual").val(ret.faseAtual);

                            $.each(ret.message, function (code, messages) {
                                toastr.success(messages.message);
                            });
                            onSuccess(ret);
                        } else {
                            $.each(ret.message, function (code, messages) {
                                toastr.warning(messages.message);
                            });
                        }
                    },
                    onCancel: () => {
                        return;
                    }
                });
            } else {
                const ret = await ApiHelper.post("/boletos/capitalgiro/create", dados, {
                    loading: { message: "Salvando Boleto, Aguarde..." },
                    headers: {
                        RequestVerificationToken:
                            $('input:hidden[name="__RequestVerificationToken"]').val()
                    },
                });

                //console.log('retorno RET1');
                //console.log(ret);

                if (ret.success) {
                    $("#Id").val(ret.id);
                    $("#FaseAtual").val(ret.faseAtual);

                    $.each(ret.message, function (code, messages) {
                        toastr.success(messages.message);
                    });
                    onSuccess(ret);
                } else {
                    $.each(ret.message, function (code, messages) {
                        toastr.warning(messages.message);
                    });
                }
            }
        } catch (e) {
            toastr.warning("Não foi possível salvar o boleto! - ", e);
        }

    } else {
        toastr.warning("Verifique o preenchimento de todos os campos obrigatórios");
    }
}


//Calculos
function calcularIOF() {
    if ($("#ValorOperacao").val() && $("#PercentualIOF").val()) {
        var ValorOperacao = Convert.moneyToNumber($("#ValorOperacao").val());
        var PercentualIOF = Convert.moneyToNumber($("#PercentualIOF").val());

        var ValorIOF = ValorOperacao * (PercentualIOF / 100);

        $("#ValorIOF").val(ValorIOF.formatMoney());
    }
}

function calcularValorLiquido() {
    if ($("#ValorOperacao").val() && $("#ValorIOF").val()) {
        var ValorOperacao = Convert.moneyToNumber($("#ValorOperacao").val());
        var ValorIOF = Convert.moneyToNumber($("#ValorIOF").val());
        var ValorComissaoIntermediacao = Convert.moneyToNumber($("#ValorComissaoIntermediacao").val());

        var ValorLiquido = ValorOperacao - ValorIOF - ValorComissaoIntermediacao;

        $("#ValorLiquido").val(ValorLiquido.formatMoney()).trigger("change");
    }
}

function calcularValorFuturo() {
      var ValorOperacao = Convert.moneyToNumber($("#ValorOperacao").val());
      var TaxaJuros = Convert.moneyToNumber($("#TaxaJuros").val());
      var PrazoDU = Convert.moneyToNumber($("#PrazoDU").val());

      //Principal*[(1+ (Taxa/100))^(DU/252)]
      var ValorFuturo = ValorOperacao * [(1 + (TaxaJuros / 100)) ^ (PrazoDU / 252)];

      $("#ValorFuturo").val(ValorFuturo.formatMoney()).trigger("change");
}

function validaTaxaJuros() {

    /*
     * Se o % Índice não estiver preenchido e/ou a Base Rate estiver preenchida.
        Se preenchida:
        • Não pode ser menor que zero e nem maior que 100. Informar caso não atenda a condição.
        • Deve ser igual ou superior à Base Rate.
        • Informar caso não atenda as condições acima:
        o Enviar mensagem pop-up no meio da tela com a necessidade de um OK para alguma divergência das regras acima.
        • Permitir enviar para aprovação caso não atenda as condições acima.
        *Não validou se esta preenchido e é obrigatório
     */
    var TaxaJuros = Convert.moneyToNumber($("#TaxaJuros").val());
    var PercIndice = Convert.moneyToNumber($("#PercIndice").val());
    var BaseRate = Convert.moneyToNumber($("#BaseRate").val());

    if (PercIndice == 0 && BaseRate > 0) {

        if (TaxaJuros < 0 || TaxaJuros > 100) {
            customModalConfirm({
                title: "Taxa Juros",
                message: "Taxa Juros deve ser maior que Zero e menor que 100.",
                isConfirm: false,
                onConfirm: () => {

                }
            });
        } else if (TaxaJuros < BaseRate) {
            customModalConfirm({
                title: "Taxa Juros",
                message: "Taxa Juros deve ser igual ou superior &agrave; Base Rate.",
                isConfirm: false,
                onConfirm: () => {

                }
            });
        }
    } 
}

function validaPercIndice() {

    /*
     *• Se a Taxa de Juros não estiver preenchida e/ou Base Rate (Índice) estiver preenchida.
Se preenchida:
• Não pode ser menor que zero e nem maior que 300. Informar caso não atenda a condição.
• Deve ser igual ou superior à Base Rate (Índice).

     */
    var TaxaJuros = Convert.moneyToNumber($("#TaxaJuros").val());
    var PercIndice = Convert.moneyToNumber($("#PercIndice").val());
    var BaseRate = Convert.moneyToNumber($("#BaseRate").val());

    if (TaxaJuros == 0 && BaseRate > 0) {
        if (PercIndice < 0 || PercIndice > 300) {
            customModalConfirm({
                title: "% &Iacute;ndice",
                message: "% &Iacute;ndice n&atilde;o pode ser menor que zero e nem maior que 300.",
                isConfirm: false,
                onConfirm: () => {
                }
            });
        }else if (PercIndice < BaseRate) {
            customModalConfirm({
                title: "% &Iacute;ndice",
                message: "% &Iacute;ndice Deve ser igual ou superior &agrave; Base Rate (&Iacute;ndice).",
                isConfirm: false,
                onConfirm: () => {
                }
            });
        }
    }
}

function validaBaseRate() {
    var BaseRate = Convert.moneyToNumber($("#BaseRate").val());
    var BaseRateIndice = Convert.moneyToNumber($("#BaseRateIndice").val());
    var TaxaJuros = Convert.moneyToNumber($("#TaxaJuros").val());

    /*
     * Se a Base Rate (Índice) não estiver preenchida e/ou Taxa de Juros estiver preenchida.
     * 
     *  Taxa Juros preenchido obriga a preencher campo Base Rate
     *  Campo Base Rate Indice não ta preenchido, obriga a preencher o campo Base Rate
     * */

    if (TaxaJuros > 0 && BaseRate == 0) {
        customModalConfirm({
            title: "% &Iacute;ndice",
            message: "Campo Base Rate &eacute; Obrigatorio o preenchimento.",
            isConfirm: false,
            onConfirm: () => {
            }
        });
    }
}

function validaBaseRateIndice() {
    var BaseRate = Convert.moneyToNumber($("#BaseRate").val());
    var BaseRateIndice = Convert.moneyToNumber($("#BaseRateIndice").val());
    var TaxaJuros = Convert.moneyToNumber($("#TaxaJuros").val());
    var PercIndice = Convert.moneyToNumber($("#PercIndice").val());

    /*
     * Se a Base Rate (Índice) não estiver preenchida e/ou Taxa de Juros estiver preenchida.
     * 
     *  Taxa Juros preenchido obriga a preencher campo Base Rate
     *  Campo Base Rate Indice não ta preenchido, obriga a preencher o campo Base Rate
     * */

    if (BaseRate == 0 && PercIndice == 0 && BaseRateIndice == 0) {
        customModalConfirm({
            title: "Base Rate &Iacute;ndice",
            message: "Campo Base Rate &Iacute;ndice &eacute; Obrigatorio o preenchimento.",
            isConfirm: false,
            onConfirm: () => {
            }
        });
    }
}