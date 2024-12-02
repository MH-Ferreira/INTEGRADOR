package com.example.demo;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;

@Entity
public class MHMovieReserva {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String nome;
    private String chaveReserva;
    private String horarioReserva;
    private String filmeEscolhido;
    @Column(columnDefinition = "LONGTEXT")
    private String imagemPerfil;  // Imagem como texto (base64)

    // Getters e Setters

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getNome() {
        return nome;
    }

    public void setNome(String nome) {
        this.nome = nome;
    }

    public String getChaveReserva() {
        return chaveReserva;
    }

    public void setChaveReserva(String chaveReserva) {
        this.chaveReserva = chaveReserva;
    }

    public String getHorarioReserva() {
        return horarioReserva;
    }

    public void setHorarioReserva(String horarioReserva) {
        this.horarioReserva = horarioReserva;
    }

    public String getFilmeEscolhido() {
        return filmeEscolhido;
    }

    public void setFilmeEscolhido(String filmeEscolhido) {
        this.filmeEscolhido = filmeEscolhido;
    }

    public String getImagemPerfil() {
        return imagemPerfil;
    }

    public void setImagemPerfil(String imagemPerfil) {
        this.imagemPerfil = imagemPerfil;
    }
    
}
