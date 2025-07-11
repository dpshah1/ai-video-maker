from manim import *

class GraphAnimation(Scene):
    def construct(self):

        circle = Circle(radius=0.5)
        self.play(Create(circle))
        self.wait(1)

        vertices = [Dot(point=RIGHT * i + UP * j) for i, j in [(0, 0), (1, 1), (2, 0), (1, -1)]]
        edges = [Line(vertices[0].get_center(), vertices[1].get_center()),
                 Line(vertices[1].get_center(), vertices[2].get_center()),
                 Line(vertices[2].get_center(), vertices[3].get_center()),
                 Line(vertices[3].get_center(), vertices[0].get_center())]

        self.play(*[Create(vertex) for vertex in vertices])
        self.play(*[Create(edge) for edge in edges])
        self.wait(1)

        path_edges = [edges[0], edges[1]]
        self.play(*[Create(edge) for edge in path_edges])
        self.wait(1)

        circle = Circle(radius=0.5)
        self.play(Create(circle))
        self.wait(1)

        walk_edges = [edges[0], edges[1], edges[1]]
        self.play(*[Create(edge) for edge in walk_edges[2:]])
        self.wait(1)

        circle = Circle(radius=0.5)
        self.play(Create(circle))
        self.wait(1)

        cycle_edges = [edges[0], edges[1], edges[2], edges[3]]
        self.play(*[Create(edge) for edge in cycle_edges])
        self.wait(1)

        circle = Circle(radius=0.5)
        self.play(Create(circle))
        self.wait(1)

        disconnected_vertices = [Dot(point=LEFT * i + UP * j) for i, j in [(0, 0), (1, 1), (2, 0)]]
        disconnected_edges = [Line(disconnected_vertices[0].get_center(), disconnected_vertices[1].get_center())]

        self.play(*[Create(vertex) for vertex in disconnected_vertices])
        self.play(*[Create(edge) for edge in disconnected_edges])
        self.wait(1)

        connected_text = Text("Connected Graph").to_edge(UP)
        circle = Circle(radius=0.5)
        self.play(Create(circle))
        self.wait(1)

        self.wait(10.4)  # Adjust to ensure total duration is 44.4 seconds