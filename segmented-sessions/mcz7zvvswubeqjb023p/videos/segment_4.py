from manim import *

class GraphAnimation(Scene):
    def construct(self):
        title = Text("Formalizing Graphs", font_size=48)
        vertices_text = Text("Vertices", font_size=36).next_to(title, DOWN)
        edges_text = Text("Edges", font_size=36).next_to(vertices_text, DOWN)
        directions_text = Text("Directions", font_size=36).next_to(edges_text, DOWN)

        self.play(Write(title))
        self.wait(0.5)

        self.play(Write(vertices_text))
        self.wait(0.5)

        self.play(Write(edges_text))
        self.wait(0.5)

        self.play(Write(directions_text))
        self.wait(1.7)

        self.clear()
        self.wait(0.5)