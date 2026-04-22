RELATÓRIO DO SISTEMA
O sistema proposto será composto por dois mecanismos principais de detecção de
descargas atmosféricas: um baseado em dados externos (via API de satélites) e outro baseado
em sensores físicos (antena receptora). Esses dois métodos trabalham de forma complementar
para aumentar a confiabilidade do sistema.
Na primeira parte, o aplicativo estará conectado a uma API de monitoramento de
descargas atmosféricas em tempo real, proveniente de redes de detecção global (satélites ou
sensores meteorológicos). Sempre que for registrada uma descarga atmosférica na região
definida, o sistema enviará um alerta ao aplicativo e poderá acionar dispositivos físicos como
buzzer e LEDs.
Na segunda parte, o sistema utilizará a antena receptora desenvolvida no projeto, que
capta sinais eletromagnéticos gerados por descargas atmosféricas próximas. Quando esses
sinais atingirem um nível considerado significativo, o microcontrolador (como o ESP32)
interpretará essa variação como um possível evento atmosférico e acionará localmente os
alertas (buzzer e iluminação).
OBS: Oque queremos é que o sistema tenha uma parte que mostre quando o sinal é
captado pela antena e assim gera o elerta, independente se os dados meteorologicos confirmem
ou não, sempre que detectar o sinal o buzzer, o LED, e a notificação são ativados. E a outra parte
que seja responsavel por gerar alerta em tempo real utilizando o API.
QUESTÃO DA INTERFACE DO SISTEMA
O projeto tem como região definida a provincia do Huambo, então logo que
aberto tem que começar com as informação dos dados meteorologicos do Huambo. Os
dados das outras provincia tambem devem ser mantidas, mas a cara ou o rosto deve ser
os do Huambo. Gostamos bastante de como tinhas criado um mecanismo de alternar
entre os dados das provincias e isso pode ser mantido.
A interface esta boa, o nome pode ser PROJETO ONZAJI, e tens que focar melhor
na parte que fala das probabilidades de cair ou não cair raio, sendo esse é o objetivo
principal do projeto.
BOM TRABALHO O RESTO ESTA PERFEITO.
https://meterelogia.vercel.app/