$(document).ready(function(){
    $(".tablelistereservation").dataTable({
        "aaSorting": [[0, 'desc']],
        "sPaginationType": "full_numbers",
        "oLanguage": {
            "sUrl": "vendor/DataTables/dt-config-fr.txt"
        },
        'bDestroy': true,
    })

    getSalles_for_autoComplete()
    getProf_for_autoComplete()

    let dateDebut = new Date();
    $("#input100-date_occupation").datepicker({
        dateFormat: "dd/mm/yyyy",
        daysOfWeekDisabled: [0], //Disable Sunday
    })
    //set Start date from Now
    $('#input100-date_occupation').datepicker('setStartDate', dateDebut);

    $("#input100-date_occupation_").datepicker({
        dateFormat: "dd/mm/yyyy",
        daysOfWeekDisabled: [0], //Disable Sunday
    });
    //set Start date from Now
    $('#input100-date_occupation_').datepicker('setStartDate', dateDebut);


    $('#occupersalle').on('click', function(){
        showModal(".container-input100.addModalPopUp")
    })

    $('#cancel_booking').on('click', function(){
        closeModal(".container-input100.addModalPopUp")
    })

    $('.close-add-popup').on('click', function(){
        closeModal(".container-input100.addModalPopUp")
    })

    $('.close-edit-popup').on('click', function () {
        closeModal(".container-input100.editModalPopUp")
    })

    $('#cancel_edit_booking').on('click', function () {
        closeModal(".container-input100.editModalPopUp")
    })

    /*****************************
     * CRUD OPERATION
     */
    $('#confirm_submit_booking').on('click', function (e) {
        let IdProf_input = $("input[name='idProf_qui_va_occuper']")
        let IdSalle_input = $("input[name='idSalle_a_occuper']")
        let dateOccupation_input = new Date($('#input100-date_occupation').datepicker("getDate")).format("dd/mm/yyyy")
        reserverSalle(IdProf_input, IdSalle_input, dateOccupation_input)
    })

    $('#confirm_edit_booking').on('click', function (e) {
        //let IdProf_input = $("input[name='idProf_qui_va_occuper_']")
        let newIdSalle_input = $("input[name='idSalle_occupe']")
        let newdateOccupation_input = new Date($('#input100-date_occupation_').datepicker("getDate")).format("dd/mm/yyyy")
        updateBooking(newIdSalle_input, newdateOccupation_input)
    })


})
/* Implement  functions*/
function closeModal(popuptoClose){
    $('.modal-limiter').removeClass('show')
    $(popuptoClose).addClass('hide')
}
function showModal(popuptoshow){
    $('.modal-limiter').addClass('show')
    $(popuptoshow).removeClass('hide')
}

function getProf_for_autoComplete(){
    let names = []
    $.ajax({
        type: "POST",
        data: {
            RequestType: "getAllProfs"
        },
        url: "Professeur",
        async: true,
        cache: false,
        dataType: 'json',
        success: function (data) {
            $.each(data, (index, response)=>{
                names.push({id_Prof : response.id_prof, fistname: response.nom})

                initializeProfAutoComplete(names)
            })
        }
    });
}

function getSalles_for_autoComplete(){
    let salles = []
    $.ajax({
        type: "POST",
        data: {
            RequestType: "getAllSalles"
        },
        url: "Salle",
        cache: false,
        dataType: 'json',
        success: function (data) {
            $.each(data, (index, response)=>{
                salles.push({id_Salle: response.id_Salle, designation_salle:response.designation})

                initializeSalleAutoComplete(salles)
            })
        }
    });
}


function initializeProfAutoComplete(profs){
    $("#input100-NomProf_qui_va_occuper").autocomplete({
        lookup: profs.map((prof)=>{
            return prof.fistname
        }),
        onSelect: function (suggestion) {
            const selectedProf = profs.find((prof) => prof.fistname === suggestion.value);
            const selectedProfId = selectedProf ? selectedProf.id_Prof : null;

            $("input[name='idProf_qui_va_occuper']").val(selectedProfId)
        }
    })
}


function initializeSalleAutoComplete(salles){
    $("#input100-salle_a_occuper").autocomplete({
        lookup: salles.map((salle)=>{
            return salle.designation_salle
        }),
        onSelect: function (suggestion) {
            const selectedSalle = salles.find((salle) => salle.designation_salle === suggestion.value);
            const selectedSalleId = selectedSalle ? selectedSalle.id_Salle : null;

            $("input[name='idSalle_a_occuper']").val(selectedSalleId)
        }
    })

    $("#input100-salle_a_occuper_").autocomplete({
        lookup: salles.map((salle)=>{
            return salle.designation_salle
        }),
        onSelect: function (suggestion) {
            const selectedSalle = salles.find((salle) => salle.designation_salle === suggestion.value);
            const selectedSalleId = selectedSalle ? selectedSalle.id_Salle : null;

            $("input[name='idSalle_occupe']").val(selectedSalleId)
        }
    })
}


function reserverSalle(_IdprofInput,_IdSalleInput,_dateOccupation_input) {
    $.ajax({
        type: "POST",
        data:{
            IdProf: _IdprofInput.val(),
            IdSalle: _IdSalleInput.val(),
            date_Occ : _dateOccupation_input,
            RequestType: "OccuperSalle"
        },
        url: "Occuper",
        cache: false,
        dataType: "json",
        success: function (data) {
            $.each(data, (index, response)=>{
                if(response.requestStatusCode == 201){
                    $.ajax({
                        type: "POST",
                        data:{
                            RequestType: "GetLastInsertBooking"
                        },
                        url: "Occuper",
                        cache: false,
                        dataType: "json",
                        success: function (data){
                            $.each(data, (index, response) => {
                                let _options = '<div class="options">'+
                                    '<button type="button" class="option-btn-item" onclick="initUpdateBooking('+ response[0] +')"><span><i class="fa fa-edit"></i></span></button>'+
                                    '<button type="button" class="option-btn-item" onclick="deleteBooking('+ response[0] +')"><span><i class="fa fa-trash"></i></span></button>'+
                                    '</div>'
                                let data = [response[0], response[1], response[2], response[3], new Date(response[4]).format("dd/MM/yyyy"), _options]

                                $(".tablelistereservation").dataTable().fnAddData(data)
                                $(".tablelistereservation tbody tr:first").attr('id', 'row'+response[0])
                            })
                        }
                    })
                    closeModal(".container-input100.addModalPopUp");
                    getTotalOcc()
                    let inputs = $("input")
                    for(let i=0; i<inputs.length; i++){
                        inputs[i].value = ""
                    }
                    showAlert(response.sucessMsg)
                }
            })
        }
    })
}

function initUpdateBooking(idReservation){
    $.ajax({
        type: "POST",
        data:{
            Id_R: idReservation,
            RequestType : "getOccById"
        },
        url: "Occuper",
        cache: false,
        dataType: "json",
        success: function (data) {
            $.each(data, (index, response)=>{
                $("#editModalPopUp-header").text("Modifier la reservation N°"+response[0])
                $("input[name='Code_R']").val(response[0])
                $("input[name='idProf_qui_occupe']").val(response[1])
                $("input[name='idSalle_occupé']").val(response[4])
                $("input[name='Prenom_prof']").val(response[3])

                $("input[name='profFirstname']").val(response[2])
                $("input[name='SalleDesignationToEdit']").val(response[5])
                $("input[name='date_occupationToEdit']").datepicker('setDate', new Date(response[6]))

                showModal(".container-input100.editModalPopUp")
            })
        }
    })
}




function deleteBooking(idReservation){
    if(confirm("Voulez-vous retirer la reservation de cette salle ?")){
        $.ajax({
            type: "POST",
            data: {
                Id_R: idReservation,
                RequestType: "DeleteOcc"
            },
            url: "Occuper",
            cache: false,
            dataType: "json",
            success:function (data) {
                $.each(data, (index, response)=>{
                    if(response.requestStatusCode == 204){
                        let row = $("#row"+idReservation+"")
                        $(".tablelistereservation").dataTable().fnDeleteRow(row)
                        getTotalOcc()
                        showAlert(response.sucessMsg)
                    }
                })
            }
        })
    }

}

function updateBooking(_newId_Salle, _newDateOcc){
    let IndexOccToUpdate = $("input[name='Code_R']").val()
    let profFirstname = $("input[name='profFirstname']").val()
    let profLastName = $("input[name='Prenom_prof']").val()
    let salleDesignation = $("input[name='SalleDesignationToEdit']").val()

    $.ajax({
        type: "POST",
        data:{
            Id_R: IndexOccToUpdate,
            newId_Salle: _newId_Salle.val(),
            newDateOcc: _newDateOcc,
            RequestType: "UpdateOcc"
        },
        url: "Occuper",
        cache: false,
        dataType: "json",
        success: function (data) {
            $.each(data, (index, response)=>{
                if(response.requestStatusCode == 200) {
                    let row = $("#row"+IndexOccToUpdate+"")
                    let options = '<div class="options">'+
                        '<button type="button" class="option-btn-item" onclick="initUpdateBooking('+IndexOccToUpdate+')"><span><i class="fa fa-edit"></i></span></button>'+
                        '<button type="button" class="option-btn-item" onclick="deleteBooking('+IndexOccToUpdate+')"><span><i class="fa fa-trash"></i></span></button>'+
                        '</div>'
                    let newData = [IndexOccToUpdate,profFirstname,profLastName,salleDesignation,_newDateOcc,options]

                    $(".tablelistereservation").DataTable().row(row).data(newData).draw(false)
                    closeModal(".container-input100.editModalPopUp")
                    showAlert(response.sucessMsg)
                }
            })
        }
    })
}
function getTotalOcc(){
    $.ajax({
        type: "POST",
        data:{
            RequestType : "getTotalOcc"
        },
        url: "Occuper",
        cache: false,
        dataType: "json",
        success: function (data) {
            $("#totalOcc").text(data.TotalOcc)
        }
    })
}
function showAlert(alertMsg){
    if ($(".alert-success").hasClass("disappered")) {
        $(".alert-success").removeClass("disappered");
        $(".alert-success").addClass("displayed");

    }

    $(".alertmsg").text(alertMsg)
    $(".alert-success").addClass("displayed")

    setTimeout(() => {
        $(".alert-success").removeClass("displayed")
        $(".alert-success").addClass("disappered")
    }, 5000)

    clearInterval()
}

function closeAlert(){
    $(".alert-success").removeClass("displayed")
    $(".alert-success").addClass("disappered")
}

