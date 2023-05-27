package com.ui.UI_frontOffice.servlet;

import com.core_backOffice.core.beans.Professeur;
import com.core_backOffice.core.service.occService;
import com.core_backOffice.core.service.profService;
import com.core_backOffice.core.service.salleService;
import com.google.gson.Gson;

import javax.servlet.*;
import javax.servlet.http.*;
import javax.servlet.annotation.*;
import java.io.IOException;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@WebServlet(name = "ProfServlet", value = "/Professeur")
public class ProfServlet extends HttpServlet {
    private final profService profService;
    private final salleService salleService ;
    private final occService occService;


    public ProfServlet(){
        this.profService = new profService();
        this.salleService = new salleService();
        this.occService = new occService();
    }
    @Override
    protected void doGet(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {
        List<Professeur> professeurs = profService.getlistProf();
        Long _totalProf = profService.getTotalProf();
        Long _totalSalle = salleService.gettotalSalle();
        Long _totalOcc = occService.getTotalOcc();

        request.setAttribute("professeurs", professeurs);
        request.setAttribute("totalProf", _totalProf);
        request.setAttribute("totalSalle", _totalSalle);
        request.setAttribute("totalOcc", _totalOcc);
        request.setAttribute("prof_link_active", true);
        this.getServletContext().getRequestDispatcher("/views/prof_front_view.jsp").forward(request, response);
    }

    @Override
    protected void doPost(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {
        if(request.getParameter("RequestType").equals("AddProf")){
            processAddProf(request, response);
        }else if(request.getParameter("RequestType").equals("GetLastInsertProf")){
            processGetLastInsertProf(request, response);
        }else if(request.getParameter("RequestType").equals("getProfById")){
            processGetProf(request, response);
        }else if(request.getParameter("RequestType").equals("UpdateProf")){
            processUpdateProf(request, response);
        }else if(request.getParameter("RequestType").equals("DeleteProf")){
            processDeleteProf(request, response);
        }else if(request.getParameter("RequestType").equals("getAllProfs")){
            processGetAllProfs(request, response);
        }else if(request.getParameter("RequestType").equals("getTotalProf")){
            processGetTotalProf(request, response);
        }
    }

    protected void processAddProf(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {
        profService.createProf(request.getParameter("firstname"), request.getParameter("lastname"), request.getParameter("grade"));

        Map dataResponse = new HashMap();

        dataResponse.put("requestStatusCode", 201);
        dataResponse.put("sucessMsg", "Le professeur a été ajouté avec succès!");

        ArrayList _dataResponse = new ArrayList();

        _dataResponse.add(dataResponse);

        String JsonResponse = new Gson().toJson(_dataResponse);

        response.setContentType("application/json");
        response.getWriter().write(JsonResponse);
    }
    protected void processGetLastInsertProf(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException{
        List<Professeur> Prof = profService.getproflastinsert();

        String JsonResponse = new Gson().toJson(Prof);
        response.setContentType("application/json");
        response.setCharacterEncoding("UTF-8");
        response.getWriter().write(JsonResponse);
    }

    protected void processGetProf(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException{
        List<Professeur> professeur = profService.getProf(Long.valueOf(request.getParameter("Id_Prof")));
        String JsonResponse = new Gson().toJson(professeur);
        response.setContentType("application/json");
        response.setCharacterEncoding("UTF-8");
        response.getWriter().write(JsonResponse);
    }

    protected void processUpdateProf(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {
        profService.updateProf(Long.valueOf(request.getParameter("Id_Prof")), request.getParameter("newfirstname"), request.getParameter("newlastname"), request.getParameter("newgrade"));

        Map dataResponse = new HashMap();

        dataResponse.put("requestStatusCode", 200);
        dataResponse.put("sucessMsg", "Les info du professeur ont été modifiées avec succès");

        ArrayList _dataResponse = new ArrayList();

        _dataResponse.add(dataResponse);

        String JsonResponse = new Gson().toJson(_dataResponse);

        System.out.println(JsonResponse);

        response.setContentType("application/json");
        response.getWriter().write(JsonResponse);
    }

    protected void processDeleteProf(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException{
        profService.deleteProf(Long.valueOf(request.getParameter("Id_Prof")));
        Map dataResponse = new HashMap();

        dataResponse.put("requestStatusCode", 204);
        dataResponse.put("sucessMsg", "Le professeur a été retirée!");

        ArrayList _dataResponse = new ArrayList();

        _dataResponse.add(dataResponse);


        String JsonResponse = new Gson().toJson(_dataResponse);

        response.setContentType("application/json");
        response.getWriter().write(JsonResponse);
    }

    protected void processGetAllProfs(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException{
        List<Professeur> professeurs = profService.getlistProf();
        String JsonResponse = new Gson().toJson(professeurs);
        response.setContentType("application/json");
        response.setCharacterEncoding("UTF-8");
        response.getWriter().write(JsonResponse);
    }

    protected void processGetTotalProf(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException{
        Map dataResponse = new HashMap();
        dataResponse.put("TotalProf", profService.getTotalProf());

        String JsonResponse = new Gson().toJson(dataResponse);
        response.setContentType("application/json");
        response.setCharacterEncoding("UTF-8");
        response.getWriter().write(JsonResponse);
    }
}
