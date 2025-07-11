from manim import *

class GraphAnimation(Scene):
    def construct(self):

        circle = Circle(radius=0.5)
        self.play(Create(circle))
        self.wait(1)

        vertices = [Dot(point=RIGHT * i + UP * j) for i, j in [(0, 0), (1, 1), (2, 0), (1, -1)]]
        edges = [
            Line(vertices[0].get_center(), vertices[1].get_center()),
            Line(vertices[1].get_center(), vertices[2].get_center()),
            Line(vertices[2].get_center(), vertices[3].get_center()),
            Line(vertices[3].get_center(), vertices[0].get_center()),
            Line(vertices[0].get_center(), vertices[2].get_center())
        ]

        self.play(*[Create(vertex) for vertex in vertices])
        self.play(*[Create(edge) for edge in edges])
        self.wait(1)

        path_edges = [edges[0], edges[1]]  # Shortest route
        cycle_edges = [edges[0], edges[1], edges[2], edges[3]]  # Cycle

        self.play(*[edge.set_color(YELLOW) for edge in path_edges])
        self.wait(1)
        self.play(*[edge.set_color(WHITE) for edge in path_edges])

        self.play(*[edge.set_color(ORANGE) for edge in cycle_edges])
        self.wait(1)
        self.play(*[edge.set_color(WHITE) for edge in cycle_edges])

        eulerian_edges = [edges[0], edges[1], edges[2], edges[3], edges[4]]  # All edges
        self.play(*[edge.set_color(GREEN) for edge in eulerian_edges])
        self.wait(1)
        self.play(*[edge.set_color(WHITE) for edge in eulerian_edges])

        self.play(FadeOut(*vertices), FadeOut(*edges))
        circle = Circle(radius=0.5)
        self.play(Create(circle))
        self.wait(1)

        koenigsberg_vertices = [Dot(point=LEFT * 2 + UP), Dot(point=LEFT * 2 + DOWN), 
                                Dot(point=RIGHT * 2 + UP), Dot(point=RIGHT * 2 + DOWN)]
        koenigsberg_edges = [
            Line(koenigsberg_vertices[0].get_center(), koenigsberg_vertices[1].get_center()),
            Line(koenigsberg_vertices[1].get_center(), koenigsberg_vertices[3].get_center()),
            Line(koenigsberg_vertices[3].get_center(), koenigsberg_vertices[2].get_center()),
            Line(koenigsberg_vertices[2].get_center(), koenigsberg_vertices[0].get_center()),
            Line(koenigsberg_vertices[0].get_center(), koenigsberg_vertices[3].get_center())
        ]

        self.play(*[Create(vertex) for vertex in koenigsberg_vertices])
        self.play(*[Create(edge) for edge in koenigsberg_edges])
        self.wait(1)

        self.play(*[edge.set_color(RED) for edge in koenigsberg_edges])
        self.wait(1)

        summary_table = Table(
            col_labels=["Concept", "Description"],
            include_outer_lines=True
        )

        self.play(Create(summary_table))
        self.wait(1)

        self.play(FadeOut(summary_table))
        self.wait(1)

        self.wait(25)