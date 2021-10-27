export default {
    title: {
        text: 'Уровень алкоголя',
        textStyle: {
            fontFamily: 'Montserrat',
            fontSize: 18,
            fontWeight: 600,
        },
        left: 'center',
    },
    legend: {
        orient: "vertical",
        left: "left",
    },
    xAxis: {
        type: 'category',
    },
    yAxis: {
        type: 'value',
    },
    tooltip: {
        trigger: "item",
        formatter: "{a} <br/>{b} : {c} ({d}%)"
    },
}