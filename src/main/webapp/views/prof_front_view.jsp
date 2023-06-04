<%@include file="../components/header.jsp"%>

<body>
    <!-- Sidebar -->
    <%@include file="../components/sidebar.jsp"%>
    <!--  -->
    <!-- MainPannel -->
        <div class="main-side">
            <!-- main-side-header -->
            <div class="card-detail-container m-t-40 limiter">
                <div class="card-detail active">
                    <div class="ico-card"><span><i class="fa fa-users"></i></span></div>
                    <div class="card-content">
                        <span class="card-title-lead m-t-10">Effectif Prof</span>
                        <div class="stat-section m-t-15">
                            <span id="totalProf"><c:out value="${totalProf}"></c:out></span>
                        </div>
                    </div>
                </div>
                <div class="card-detail">
                    <div class="ico-card"><span><i class="fa fa-house-circle-check"></i></span></div>
                    <div class="card-content">
                        <span class="card-title-lead m-t-10">Total Salle</span>
                        <div class="stat-section m-t-15">
                            <span id="totalSalle"><c:out value="${totalSalle}"></c:out></span>
                        </div>
                    </div>
                </div>
                <div class="card-detail">
                    <div class="ico-card"><span><i class="fa fa-house-lock"></i></span></div>
                    <div class="card-content">
                        <span class="card-title-lead m-t-10">Salle Occupée</span>
                        <div class="stat-section m-t-15">
                            <span id="totalOcc"><c:out value="${totalOcc}"></c:out></span>
                        </div>
                    </div>
                </div>
            </div>
            <!--  -->

            <!-- Alert Section -->
            <div class="alert-container">
                <div class="alert-success">
                    <div class="ico-alert"><span class="shake"><i class="bi bi-bell"></i></span></div>
                    <div class="alert-success-content">
                        <span class="close-btn"><i class="fa fa-times-circle"></i></span>
                        <span class="alertmsg"></span>
                    </div>
                </div>
            </div>
            <!---->

            <!-- Filtre avancée -->
            <div class="filtreAvance-section m-t-50 limiter" id="accordion_search_prof" role="tablist" aria-multiselectable="true">
                <div class="filtreAvance-content">
                    <div class="ico-accordion"><span><i class="fa fa-search"></i></span></div>
                    <div class="heading-content" role="tab" id="headingOne">
                        <h4 class="content-title">
                            <a role="button" data-toggle="collapse" data-parent="#accordion_search_prof" href="#search_prof"
                            aria-expanded="true" aria-controls="collapseOne" title="Afficher/Masquer les filtres"
                            class="accordion-title collapsed">
                                <i class="fa fa-angle-right"></i>
                            </a>
                        </h4>
                    </div>
                    <div id="search_prof" class="content-body collapse" role="tabpanel" aria-labelledby="headingOne">
                        <form class="accordion-form" id="search_prof_form">
                            <div class="field-row">
                                <div class="wrap-input100">
                                    <label for="input100-id_prof_for_search">Code Prof</label>
                                    <input type="text" name="id_prof_for_search" class="input100 m-t-15" id="input100-id_prof_for_search" placeholder="Ecrire ici...">
                                </div>
                                <div class="wrap-input100">
                                    <label for="input100-name_prof_for_search">Nom du Prof</label>
                                    <input type="text" name="name_prof_for_search" class="input100 m-t-15" id="input100-name_prof_for_search" placeholder="John...">
                                </div>
                            </div>
                            <div class="button_group m-t-20">
                                <button class="btn-form primary-btn" id="searchProf_btn" type="button"
                                        title="Rechercher">
                                    <i class="fa fa-search"></i>
                                    Rechercher
                                </button>
                                <button type="reset" class="btn-form secondary-btn" id="reinitialiserProfSearch"
                                        title="Réinitialiser">
                                    <i class="fa fa-times"></i>
                                    Réinitialiser
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
            <!---->
            <!-- Add-form-popup -->
            <div class="modal-limiter">
                <div class="overlay"></div>
                <!-- Add Modal PopUP-->
                <div class="container-input100 addModalPopUp hide">
                    <div class="wrap-form100">
                        <div class="modal-header">
                            <button class="closepopup close-add-popup"><i class="fa fa-times"></i></button>
                            <span class="modal-header-title">
                                Ajouter un Professeur
                            </span>
                        </div>
                        <div class="add-prof-form m-t-30">
                            <div class="wrap-input100">
                                <label for="input100-Nom">Nom</label>
                                <input type="text" class="input100 m-t-10" id="input100-Nom" placeholder="John" name="firstnameProfToAdd">
                                <div class="alert-wrapper">
                                    <div class="error">
                                        <i class="fa fa-exclamation-circle"></i>
                                        <span class="error-msg"></span>
                                    </div>
                                </div>
                            </div>
                            <div class="wrap-input100">
                                <label for="input100-prenom">Prénom</label>
                                <input type="text" class="input100 m-t-10" id="input100-prenom" placeholder="Doe" name="lastnameProfToAdd">
                            </div>
                            <div class="wrap-input100">
                                <label for="select100-grade">Grade</label>
                                <select class="select100 m-t-10" id="select100-grade" name="gradeProfToAdd">
                                    <option value="Assistant">Assistant</option>
                                    <option value="Professeur titulaire">Professeur titulaire</option>
                                    <option value="Responsable Mention">Responsable Mention</option>
                                    <option value="Vacataire">Vacataire</option>
                                </select>
                            </div>
                            <div class="alert-wrapper global-error">
                                <div class="globalerror-container">
                                    <i class="fa fa-exclamation-circle"></i>
                                    <span class="globalerror-msg"></span>
                                </div>
                            </div>
                            <div class="button_group m-t-30">
                                <button class="btn-form primary-btn" id="confirm_submit_prof" type="button">
                                    <i class="fa fa-save"></i>
                                    Confirmer
                                </button>
                                <button type="reset" class="btn-form secondary-btn" id="cancel_add_prof">
                                    <i class="fa fa-times"></i>
                                    Annuler
                                </button>
                            </div>
                        </div>
                    </div>                    
                </div>
                <!---->
                <!-- Edit Modal Pop UP -->
                <div class="container-input100 editModalPopUp hide">
                    <div class="wrap-form100">
                        <div class="modal-header">
                            <button class="closepopup close-edit-popup"><i class="fa fa-times"></i></button>
                            <span class="modal-header-title" id="editModalPopUp-header">

                            </span>
                        </div>
                        <div class="edit-prof-form m-t-30">
                            <input type="hidden" name="IdProf">
                            <div class="wrap-input100">
                                <label for="input100-Nom_">Nom</label>
                                <input type="text" class="input100 m-t-10" id="input100-Nom_" placeholder="John" name="firstnameProfToEdit">
                                <div class="alert-wrapper">
                                    <div class="error">
                                        <i class="fa fa-exclamation-circle"></i>
                                        <span class="error-msg"></span>
                                    </div>
                                </div>
                            </div>
                            <div class="wrap-input100">
                                <label for="input100-prenom_">Prénom</label>
                                <input type="text" class="input100 m-t-10" id="input100-prenom_" placeholder="Doe" name="lastnameProfToEdit">
                            </div>
                            <div class="wrap-input100">
                                <label for="select100-grade_">Grade</label>
                                <select class="select100 m-t-10" id="select100-grade_" name="gradeProfToEdit">
                                    <option value="Assistant">Assistant</option>
                                    <option value="Professeur titulaire">Professeur titulaire</option>
                                    <option value="Responsable Mention">Responsable Mention</option>
                                    <option value="Vacataire">Vacataire</option>
                                </select>
                            </div>
                            <div class="alert-wrapper global-error">
                                <div class="globalerror-container">
                                    <i class="fa fa-exclamation-circle"></i>
                                    <span class="globalerror-msg"></span>
                                </div>
                            </div>
                            <div class="button_group m-t-30">
                                <button class="btn-form primary-btn" id="confirm_edit_prof" type="button">
                                    <i class="fa fa-save"></i>
                                    Confirmer
                                </button>
                                <button type="reset" class="btn-form secondary-btn" id="cancel_edit_prof">
                                    <i class="fa fa-times"></i>
                                    Annuler
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
                <!---->
            </div>

            <!--  -->

            <!-- Tab -->
            <div class="tab-list-container m-t-60 m-b-60 limiter">
                <div class="tablist-section">
                    <div class="tab-header-section">
                        <h3 class="table-header-title-lead ">LISTE DES PROFESSEURS</h3>
                        <button class="btn-add primary-btn" id="addProf" type="button"
                                title="Ajouer un professeur">
                            <i class="bi bi-person-plus m-r-5"></i>
                            Ajouter
                        </button>
                    </div>
                    <div class="panel-body">
                        <table class="table table-striped table-bordered table-condensed tablelisteProf">
                        <thead>
                            <tr>
                                <th>CodeProf</th>
                                <th>Nom</th>
                                <th>Prénom</th>
                                <th>Grade</th>
                                <th class="no-sorting"></th>
                            </tr>
                        </thead>
                        <tbody class="table-border-bottom-0">
                            <c:forEach items="${professeurs}" var="professeur">
                            <tr id="row<c:out value="${professeur.id_prof}"></c:out>">
                                <td><c:out value="${professeur.id_prof}"></c:out></td>
                                <td><c:out value="${professeur.nom}"></c:out></td>
                                <td><c:out value="${professeur.prenom}"></c:out></td>
                                <td><c:out value="${professeur.grade}"></c:out></td>
                                <td>
                                    <div class="options">
                                        <button type="button" class="option-btn-item" onclick='initUpdateProf(<c:out value="${professeur.id_prof}"/>)'><i class="fa fa-edit"></i></button>
                                        <button type="button" class="option-btn-item" onclick='deleteProf(<c:out value="${professeur.id_prof}"/>)'><i class="fa fa-trash"></i></button>
                                    </div>
                                </td>
                            </tr>
                            </c:forEach>
                        </tbody>
                        </table>
                    </div>
                </div>
            </div>
            <!--  -->
        </div>
    <!--  -->
    <script src="js/script_prof.js"></script>
</body>
</html>