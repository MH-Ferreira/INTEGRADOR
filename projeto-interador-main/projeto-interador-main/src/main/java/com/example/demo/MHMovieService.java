package com.example.demo;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class MHMovieService {

    @Autowired
    private MHMovieRepository repository;

    // Salvar nova reserva
    public MHMovieReserva salvar(MHMovieReserva reserva) {
        return repository.save(reserva);
    }

    // Listar todas as reservas
    public List<MHMovieReserva> listarTodos() {
        return repository.findAll();
    }

    // Atualizar uma reserva
    public MHMovieReserva atualizar(Long id, MHMovieReserva reserva) {
        Optional<MHMovieReserva> existingReserva = repository.findById(id);
        if (existingReserva.isPresent()) {
            reserva.setId(id);
            return repository.save(reserva);
        }
        return null;
    }

    // Deletar uma reserva
    public void deletar(Long id) {
        repository.deleteById(id);
    }

    public MHMovieReserva buscarPorId(Long id) {
        return repository.findById(id).orElse(null); // Retorna o objeto ou null se não encontrado
    }

    
    
}
